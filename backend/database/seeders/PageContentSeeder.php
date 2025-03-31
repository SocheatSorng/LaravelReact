<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PageContent;

class PageContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create blog page content
        PageContent::create([
            'slug' => 'blog-page',
            'title' => 'Blog',
            'description' => 'The main blog listing page',
            'type' => 'blog',
            'status' => 'published',
            'content' => [
                'root' => [
                    'title' => 'Blog Page',
                    'description' => 'Our blog articles and news'
                ],
                'content' => [
                    [
                        'type' => 'Hero',
                        'props' => [
                            'title' => 'Our Blog',
                            'subtitle' => 'Stay up to date with our latest news and articles',
                            'buttonText' => 'View Latest',
                            'buttonLink' => '#latest',
                            'backgroundImage' => 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=1470&auto=format&fit=crop'
                        ]
                    ]
                ]
            ]
        ]);

        // Create about page content
        PageContent::create([
            'slug' => 'about-page',
            'title' => 'About Us',
            'description' => 'Learn more about our bookstore and team',
            'type' => 'page',
            'status' => 'published',
            'content' => [
                'root' => [
                    'title' => 'About Our Bookstore',
                    'description' => 'The story behind our bookstore'
                ],
                'content' => [
                    [
                        'type' => 'Hero',
                        'props' => [
                            'title' => 'About Us',
                            'subtitle' => 'Our story and mission',
                            'buttonText' => 'Contact Us',
                            'buttonLink' => '/contact',
                            'backgroundImage' => 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1470&auto=format&fit=crop'
                        ]
                    ],
                    [
                        'type' => 'TextBlock',
                        'props' => [
                            'heading' => 'Our Story',
                            'content' => 'Founded in 2020, our bookstore has been dedicated to bringing the best books to our community. We believe in the power of stories to inspire, educate, and entertain.',
                            'textAlign' => 'left'
                        ]
                    ]
                ]
            ]
        ]);

        // Create contact page content
        PageContent::create([
            'slug' => 'contact-page',
            'title' => 'Contact Us',
            'description' => 'Get in touch with our team',
            'type' => 'page',
            'status' => 'published',
            'content' => [
                'root' => [
                    'title' => 'Contact Us',
                    'description' => 'Ways to reach our team'
                ],
                'content' => [
                    [
                        'type' => 'Hero',
                        'props' => [
                            'title' => 'Contact Us',
                            'subtitle' => 'We\'d love to hear from you',
                            'buttonText' => 'Send Message',
                            'buttonLink' => '#contact-form',
                            'backgroundImage' => 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1470&auto=format&fit=crop'
                        ]
                    ],
                    [
                        'type' => 'TextBlock',
                        'props' => [
                            'heading' => 'Get In Touch',
                            'content' => 'Email us at support@bookstore.com or call us at (123) 456-7890. Our customer service team is available Monday through Friday, 9am to 5pm.',
                            'textAlign' => 'center'
                        ]
                    ]
                ]
            ]
        ]);
    }
}
