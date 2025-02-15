<?php
if (!defined('ABSPATH')) exit;

// Theme Setup
function propvid_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'propvid'),
        'footer' => __('Footer Menu', 'propvid')
    ));
}
add_action('after_setup_theme', 'propvid_setup');

// Enqueue Scripts and Styles
function propvid_scripts() {
    wp_enqueue_style('tailwindcss', get_template_directory_uri() . '/assets/css/tailwind.min.css');
    wp_enqueue_style('propvid-style', get_stylesheet_uri());
    
    wp_enqueue_script('propvid-scripts', get_template_directory_uri() . '/assets/js/scripts.js', array('jquery'), '1.0', true);
    
    // Localize script for AJAX
    wp_localize_script('propvid-scripts', 'propvidAjax', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('propvid-nonce')
    ));
}
add_action('wp_enqueue_scripts', 'propvid_scripts');

// Custom Post Types
function propvid_register_post_types() {
    // Templates
    register_post_type('video_template', array(
        'labels' => array(
            'name' => __('Video Templates', 'propvid'),
            'singular_name' => __('Video Template', 'propvid')
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-video-alt'
    ));
    
    // Testimonials
    register_post_type('testimonial', array(
        'labels' => array(
            'name' => __('Testimonials', 'propvid'),
            'singular_name' => __('Testimonial', 'propvid')
        ),
        'public' => true,
        'has_archive' => false,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-format-quote'
    ));
}
add_action('init', 'propvid_register_post_types');

// Custom Fields
function propvid_register_meta_boxes() {
    add_meta_box(
        'template_details',
        __('Template Details', 'propvid'),
        'propvid_template_meta_box',
        'video_template'
    );
    
    add_meta_box(
        'testimonial_details',
        __('Testimonial Details', 'propvid'),
        'propvid_testimonial_meta_box',
        'testimonial'
    );
}
add_action('add_meta_boxes', 'propvid_register_meta_boxes');

// AJAX Handlers
function propvid_generate_video() {
    check_ajax_referer('propvid-nonce', 'nonce');
    
    // Handle video generation logic here
    
    wp_send_json_success(array(
        'message' => 'Video generated successfully'
    ));
}
add_action('wp_ajax_generate_video', 'propvid_generate_video');
add_action('wp_ajax_nopriv_generate_video', 'propvid_generate_video');