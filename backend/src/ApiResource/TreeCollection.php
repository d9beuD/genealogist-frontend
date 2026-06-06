<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Dto\TreeOutput;
use App\State\TreesProvider;

#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/trees',
            output: TreeOutput::class,
            security: "is_granted('ROLE_USER')",
            provider: TreesProvider::class,
        ),
    ],
)]
final class TreeCollection {}
