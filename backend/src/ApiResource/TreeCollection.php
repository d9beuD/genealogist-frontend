<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Dto\CreateTreeInput;
use App\Dto\TreeOutput;
use App\State\CreateTreeProcessor;
use App\State\TreesProvider;

#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/trees',
            output: TreeOutput::class,
            security: "is_granted('ROLE_USER')",
            provider: TreesProvider::class,
        ),
        new Post(
            uriTemplate: '/trees',
            input: CreateTreeInput::class,
            output: TreeOutput::class,
            security: "is_granted('ROLE_USER')",
            processor: CreateTreeProcessor::class,
        ),
    ],
)]
final class TreeCollection {}
