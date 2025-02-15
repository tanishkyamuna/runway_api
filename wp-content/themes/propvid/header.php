<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <header class="bg-white border-b sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <?php
                    if (has_custom_logo()) {
                        the_custom_logo();
                    } else {
                        echo '<a href="' . esc_url(home_url('/')) . '" class="text-2xl font-bold text-blue-600 flex items-center">' . get_bloginfo('name') . '</a>';
                    }
                    ?>
                    
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'primary',
                        'container_class' => 'hidden md:ml-8 md:flex md:items-center md:space-x-4',
                        'menu_class' => 'flex space-x-4'
                    ));
                    ?>
                </div>
                
                <div class="hidden md:flex md:items-center md:space-x-4">
                    <?php if (is_user_logged_in()): ?>
                        <a href="<?php echo esc_url(home_url('/account')); ?>" class="text-gray-500 hover:text-gray-900">
                            My Account
                        </a>
                    <?php else: ?>
                        <a href="<?php echo esc_url(home_url('/pricing')); ?>" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Start Free Trial
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </header>