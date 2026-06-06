<?php

declare(strict_types=1);

namespace App\Tests\Api;

use App\Entity\Tree;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class TreesTest extends WebTestCase
{
    private EntityManagerInterface $entityManager;

    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient([], ['HTTPS' => 'on']);
        $this->entityManager = static::getContainer()->get('doctrine')->getManager();

        $this->ensureSchemaExists();
        $this->deleteTestData();
    }

    protected function tearDown(): void
    {
        $this->deleteTestData();

        parent::tearDown();
    }

    public function testGetTreesRequiresAuthentication(): void
    {
        $this->client->jsonRequest('GET', '/api/trees');

        self::assertResponseStatusCodeSame(401);
    }

    public function testGetTreesReturnsOnlyAuthenticatedUserTrees(): void
    {
        $owner = $this->createUser('trees-owner@example.com', 'password');
        $otherUser = $this->createUser('trees-other@example.com', 'password');

        $this->createTree($owner, 'Owner older tree', new \DateTimeImmutable('2026-01-01'));
        $this->createTree($owner, 'Owner newer tree', new \DateTimeImmutable('2026-02-01'));
        $this->createTree($otherUser, 'Other tree', new \DateTimeImmutable('2026-03-01'));

        $this->client->jsonRequest('POST', '/api/auth', [
            'email' => 'trees-owner@example.com',
            'password' => 'password',
        ]);
        self::assertResponseIsSuccessful();

        $this->client->jsonRequest('GET', '/api/trees');

        self::assertResponseStatusCodeSame(200);
        self::assertResponseHeaderSame('content-type', 'application/json; charset=utf-8');

        $response = json_decode((string) $this->client->getResponse()->getContent(), true, flags: JSON_THROW_ON_ERROR);

        self::assertCount(2, $response);
        self::assertSame(['Owner newer tree', 'Owner older tree'], array_column($response, 'name'));
        self::assertNotContains('Other tree', array_column($response, 'name'));

        foreach ($response as $tree) {
            self::assertArrayHasKey('id', $tree);
            self::assertArrayHasKey('name', $tree);
            self::assertArrayHasKey('createdAt', $tree);
            self::assertArrayNotHasKey('user', $tree);
            self::assertArrayNotHasKey('members', $tree);
        }
    }

    private function createUser(string $email, string $plainPassword): User
    {
        $user = new User()
            ->setEmail($email)
            ->setFirstname('Trees')
            ->setLastname('User')
            ->setIsVerified(true)
        ;

        $user->setPassword(
            static::getContainer()->get(UserPasswordHasherInterface::class)->hashPassword($user, $plainPassword),
        );

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }

    private function createTree(User $user, string $name, \DateTimeImmutable $createdAt): void
    {
        $tree = new Tree()
            ->setUser($user)
            ->setName($name)
            ->setCreatedAt($createdAt)
        ;

        $this->entityManager->persist($tree);
        $this->entityManager->flush();
    }

    private function ensureSchemaExists(): void
    {
        $schemaTool = new SchemaTool($this->entityManager);
        $schemaTool->updateSchema($this->entityManager->getMetadataFactory()->getAllMetadata());
    }

    private function deleteTestData(): void
    {
        $this->entityManager->createQuery('DELETE FROM App\Entity\Tree tree WHERE tree.name LIKE :pattern')
            ->setParameter('pattern', 'Owner %')
            ->execute()
        ;
        $this->entityManager->createQuery('DELETE FROM App\Entity\Tree tree WHERE tree.name = :name')
            ->setParameter('name', 'Other tree')
            ->execute()
        ;
        $this->entityManager->createQuery('DELETE FROM App\Entity\User user WHERE user.email LIKE :pattern')
            ->setParameter('pattern', 'trees-%')
            ->execute()
        ;
    }
}
