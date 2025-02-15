<footer class="bg-gray-900 text-white">
        <div class="max-w-7xl mx-auto px-4 py-12">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <a href="<?php echo esc_url(home_url('/')); ?>" class="text-2xl font-bold">
                        <?php bloginfo('name'); ?>
                    </a>
                    <p class="mt-4 text-gray-400">
                        <?php bloginfo('description'); ?>
                    </p>
                </div>
                
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'footer',
                    'container_class' => 'md:col-span-2',
                    'menu_class' => 'grid grid-cols-2 gap-8'
                ));
                ?>
                
                <div>
                    <h3 class="font-bold text-lg mb-4"><?php _e('Contact', 'propvid'); ?></h3>
                    <?php if (get_theme_mod('propvid_contact_email')): ?>
                        <a href="mailto:<?php echo esc_attr(get_theme_mod('propvid_contact_email')); ?>" class="text-gray-400 hover:text-white transition-colors block mb-2">
                            <?php echo esc_html(get_theme_mod('propvid_contact_email')); ?>
                        </a>
                    <?php endif; ?>
                </div>
            </div>
            
            <div class="mt-12 pt-8 border-t border-gray-800">
                <div class="text-center text-gray-400">
                    &copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. <?php _e('All rights reserved.', 'propvid'); ?>
                </div>
            </div>
        </div>
    </footer>
    
    <?php wp_footer(); ?>
</body>
</html>