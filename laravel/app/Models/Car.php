<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Car extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'brand',
        'model',
        'year',
        'price',
        'description',
        'specifications',
        'featured',
        'active',
    ];

    protected $casts = [
        'id' => 'string',
        'year' => 'integer',
        'price' => 'decimal:2',
        'specifications' => 'array', // automatically handles casting Range, Speed, Drivetrain, etc.
        'featured' => 'boolean',
        'active' => 'boolean',
    ];

    /**
     * Get the images associated with the car.
     */
    public function images(): HasMany
    {
        return $this->hasMany(CarImage::class)->orderBy('sort_order');
    }
}
