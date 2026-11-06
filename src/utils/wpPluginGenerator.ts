import JSZip from 'jszip';
import { PluginConfig, NoticeItem, STYLE_PRESETS } from '../types/plugin';

export interface GeneratedPluginFile {
  path: string;
  filename: string;
  language: 'php' | 'css' | 'javascript' | 'text';
  description: string;
  content: string;
}

function escapePhpSingleQuote(str: string): string {
  return String(str ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

function generatePhpNoticeArrayItem(n: NoticeItem): string {
  return `        array(
            'id'                    => '${escapePhpSingleQuote(n.id)}',
            'internal_name'         => '${escapePhpSingleQuote(n.internalName)}',
            'enabled'               => '${n.enabled ? '1' : '0'}',
            'priority'              => ${Number(n.priority) || 1},
            'notice_version'        => '${escapePhpSingleQuote(n.noticeVersion)}',
            'show_icon'             => '${n.showIcon ? '1' : '0'}',
            'icon_type'             => '${escapePhpSingleQuote(n.iconType)}',
            'show_badge'            => '${n.showBadge ? '1' : '0'}',
            'badge_text'            => '${escapePhpSingleQuote(n.badgeText)}',
            'show_title'            => '${n.showTitle ? '1' : '0'}',
            'title'                 => '${escapePhpSingleQuote(n.title)}',
            'show_subtitle'         => '${n.showSubtitle ? '1' : '0'}',
            'subtitle'              => '${escapePhpSingleQuote(n.subtitle)}',
            'content_html'          => '${escapePhpSingleQuote(n.contentHtml)}',
            'require_checkbox'      => '${n.requireCheckbox ? '1' : '0'}',
            'checkbox_label'        => '${escapePhpSingleQuote(n.checkboxLabel)}',
            'checkbox_error'        => '${escapePhpSingleQuote(n.checkboxRequiredError)}',
            'accept_btn_text'       => '${escapePhpSingleQuote(n.acceptButtonText)}',
            'secondary_btn_enabled' => '${n.secondaryButtonEnabled ? '1' : '0'}',
            'secondary_btn_text'    => '${escapePhpSingleQuote(n.secondaryButtonText)}',
            'secondary_btn_url'     => '${escapePhpSingleQuote(n.secondaryButtonUrl)}',
            'banner_image_url'      => '${escapePhpSingleQuote(n.bannerImageUrl)}',
            'style_preset'          => '${escapePhpSingleQuote(n.stylePreset)}',
            'inherit_theme_font'    => '${n.inheritThemeFont ? '1' : '0'}',
            'position'              => '${escapePhpSingleQuote(n.position)}',
            'animation'             => '${escapePhpSingleQuote(n.animation)}',
            'width_px'              => ${Number(n.widthPx) || 540},
            'border_radius_px'      => ${Number(n.borderRadiusPx) || 20},
            'backdrop_blur_px'      => ${Number(n.backdropBlurPx) || 12},
            'overlay_opacity'       => ${Number(n.overlayOpacity) || 70},
            'primary_color'         => '${escapePhpSingleQuote(n.primaryColor)}',
            'button_text_color'     => '${escapePhpSingleQuote(n.buttonTextColor)}',
            'accent_color'          => '${escapePhpSingleQuote(n.accentColor)}',
            'bg_color'              => '${escapePhpSingleQuote(n.backgroundColor)}',
            'text_color'            => '${escapePhpSingleQuote(n.textColor)}',
            'subtitle_color'        => '${escapePhpSingleQuote(n.subtitleColor)}',
            'body_box_bg'           => '${escapePhpSingleQuote(n.bodyBoxBg)}',
            'body_box_text'         => '${escapePhpSingleQuote(n.bodyBoxText)}',
            'body_box_border'       => '${escapePhpSingleQuote(n.bodyBoxBorder)}',
            'checkbox_box_bg'       => '${escapePhpSingleQuote(n.checkboxBoxBg)}',
            'checkbox_box_text'     => '${escapePhpSingleQuote(n.checkboxBoxText)}',
            'custom_css'            => '${escapePhpSingleQuote(n.customCss)}',
            'countdown_seconds'     => ${Number(n.countdownSeconds) || 0},
            'prevent_backdrop_close'=> '${n.preventCloseOnBackdrop ? '1' : '0'}',
            'prevent_esc_close'     => '${n.preventEscapeKey ? '1' : '0'}',
            'hide_close_btn'        => '${n.hideCloseButton ? '1' : '0'}',
            'display_target'        => '${escapePhpSingleQuote(n.displayTarget)}',
            'pt_post'               => '${n.targetPostTypes.post ? '1' : '0'}',
            'pt_page'               => '${n.targetPostTypes.page ? '1' : '0'}',
            'pt_product'            => '${n.targetPostTypes.product ? '1' : '0'}',
            'pt_custom'             => '${escapePhpSingleQuote(n.targetPostTypes.customPostTypes)}',
            'tax_category'          => '${n.targetTaxonomies.category ? '1' : '0'}',
            'tax_post_tag'          => '${n.targetTaxonomies.postTag ? '1' : '0'}',
            'tax_product_cat'       => '${n.targetTaxonomies.productCat ? '1' : '0'}',
            'tax_product_tag'       => '${n.targetTaxonomies.productTag ? '1' : '0'}',
            'tax_terms'             => '${escapePhpSingleQuote(n.targetTaxonomies.specificTerms)}',
            'woo_shop'              => '${n.targetWooPages.shop ? '1' : '0'}',
            'woo_product'           => '${n.targetWooPages.product ? '1' : '0'}',
            'woo_category'          => '${n.targetWooPages.productCategory ? '1' : '0'}',
            'woo_cart'              => '${n.targetWooPages.cart ? '1' : '0'}',
            'woo_checkout'          => '${n.targetWooPages.checkout ? '1' : '0'}',
            'woo_account'           => '${n.targetWooPages.account ? '1' : '0'}',
            'include_pages'         => '${escapePhpSingleQuote(n.includePageIdsOrUrls)}',
            'exclude_pages'         => '${escapePhpSingleQuote(n.excludePageIdsOrUrls)}',
            'target_user_roles'     => '${escapePhpSingleQuote(n.targetUserRoles)}',
            'trigger_type'          => '${escapePhpSingleQuote(n.triggerType)}',
            'delay_seconds'         => ${Number(n.delaySeconds) || 3},
            'scroll_pixels'         => ${Number(n.scrollPixels) || 300},
            'session_mode'          => '${escapePhpSingleQuote(n.sessionMode)}',
            'cookie_expire_days'    => ${Number(n.cookieExpireDays) || 30},
        )`;
}

export function generateWordPressPluginFiles(config: PluginConfig): GeneratedPluginFile[] {
  const noticesPhpArray = config.notices.map(generatePhpNoticeArrayItem).join(',\n');

  const presetsDataJson = JSON.stringify(
    STYLE_PRESETS.reduce((acc, p) => {
      acc[p.id] = {
        palette: p.palette,
        harmonies: p.recommendedHarmonies,
      };
      return acc;
    }, {} as Record<string, any>)
  );

  const mainPhp = `<?php
/**
 * Plugin Name:       اطلاع رسانی پاپ آپ | Smart Popup Notice Pro
 * Plugin URI:        ${config.developerUrl}
 * Description:       افزونه جامع و مدرن اطلاع‌رسانی پاپ‌آپ و تعهدنامه با چک‌باکس تایید اجباری، داشبورد آماری ایجکس، شرط‌های پست‌تایپ و تکسونومی، نمایش در هر سشن یا بعد از اسکرول/ثانیه و ارث‌بری فونت از قالب.
 * Version:           3.0.0
 * Requires at least: ${config.wpVersion}
 * Tested up to:      ${config.wpVersion}
 * Requires PHP:      ${config.phpVersion}
 * WC requires at least: ${config.wcVersion}
 * WC tested up to:   ${config.wcVersion}
 * Author:            ${config.developerName} (${config.developerPhone})
 * Author URI:        ${config.developerUrl}
 * Text Domain:       popup-notice-pro
 * Domain Path:       /languages
 * License:           GPL v2 or later
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'PNP_VERSION', '3.0.0' );
define( 'PNP_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'PNP_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'PNP_OPTION_KEY', 'pnp_notices_v3' );

/**
 * Declare compatibility with WooCommerce 11.1+ HPOS & Cart/Checkout Blocks
 */
add_action( 'before_woocommerce_init', function() {
    if ( class_exists( \\Automattic\\WooCommerce\\Utilities\\FeaturesUtil::class ) ) {
        \\Automattic\\WooCommerce\\Utilities\\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
        \\Automattic\\WooCommerce\\Utilities\\FeaturesUtil::declare_compatibility( 'cart_checkout_blocks', __FILE__, true );
    }
} );

/**
 * Default pre-configured notices
 */
function pnp_get_default_notices(): array {
    return array(
${noticesPhpArray}
    );
}

/**
 * Retrieve all configured notices (lightweight single-option storage, zero custom SQL tables)
 */
function pnp_get_notices(): array {
    $saved = get_option( PNP_OPTION_KEY, null );
    if ( ! is_array( $saved ) ) {
        return pnp_get_default_notices();
    }
    return array_values( $saved );
}

/**
 * Save notices array with autoload disabled so wp_options stays ultra-light
 */
function pnp_save_notices( array $notices ): void {
    update_option( PNP_OPTION_KEY, array_values( $notices ), false );
}

/**
 * Helper function to invoke a specific popup notice anywhere in PHP templates
 */
function popup_notice_render( string $notice_id ): void {
    echo do_shortcode( '[popup_notice id="' . esc_attr( $notice_id ) . '"]' );
}

/**
 * Inline SVG Icon Renderer
 */
function pnp_get_icon_svg( string $type, string $color = 'currentColor' ): string {
    $c = esc_attr( $color );
    switch ( $type ) {
        case 'bell':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="' . $c . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>';
        case 'alert':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="' . $c . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
        case 'sparkles':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="' . $c . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>';
        case 'check':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="' . $c . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>';
        case 'cart':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="' . $c . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>';
        case 'shield':
        default:
            return '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="' . $c . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>';
    }
}

register_activation_hook( __FILE__, function() {
    if ( null === get_option( PNP_OPTION_KEY, null ) ) {
        pnp_save_notices( pnp_get_default_notices() );
    }
} );

require_once PNP_PLUGIN_DIR . 'includes/class-pnp-admin.php';
require_once PNP_PLUGIN_DIR . 'includes/class-pnp-frontend.php';

add_action( 'plugins_loaded', function() {
    if ( is_admin() ) {
        new PNP_Admin();
    }
    new PNP_Frontend();
} );
`;

  const adminPhp = `<?php
/**
 * Modern AJAX Admin Dashboard & Submenus for "اطلاع رسانی پاپ آپ" (v3.0)
 * Menu Structure:
 *  - اطلاع رسانی پاپ آپ (Main Menu)
 *    - پیشخوان و آمار (Dashboard & Stats)
 *    - همه اطلاعیه ها (AJAX List Manager)
 *    - افزودن اطلاعیه جدید (AJAX Editor - stays on page after save!)
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class PNP_Admin {

    public function __construct() {
        add_action( 'admin_menu', array( $this, 'register_admin_menus' ) );
        add_filter( 'plugin_action_links_' . plugin_basename( PNP_PLUGIN_DIR . 'popup-notice-pro.php' ), array( $this, 'add_settings_link' ) );

        // AJAX Endpoints for seamless, zero-reload admin UX
        add_action( 'wp_ajax_pnp_ajax_save_notice', array( $this, 'ajax_save_notice' ) );
        add_action( 'wp_ajax_pnp_ajax_toggle_notice', array( $this, 'ajax_toggle_notice' ) );
        add_action( 'wp_ajax_pnp_ajax_duplicate_notice', array( $this, 'ajax_duplicate_notice' ) );
        add_action( 'wp_ajax_pnp_ajax_delete_notice', array( $this, 'ajax_delete_notice' ) );
    }

    public function add_settings_link( array $links ): array {
        $dashboard_link = '<a href="' . esc_url( admin_url( 'admin.php?page=popup-notice-dashboard' ) ) . '" style="font-weight:bold;color:#2563eb;">داشبورد اطلاع‌رسانی</a>';
        array_unshift( $links, $dashboard_link );
        return $links;
    }

    public function register_admin_menus(): void {
        add_menu_page(
            'اطلاع رسانی پاپ آپ',
            'اطلاع رسانی پاپ آپ',
            'manage_options',
            'popup-notice-dashboard',
            array( $this, 'render_dashboard_page' ),
            'dashicons-megaphone',
            58
        );

        add_submenu_page(
            'popup-notice-dashboard',
            'پیشخوان و آمار اطلاعیه‌ها',
            'پیشخوان و آمار',
            'manage_options',
            'popup-notice-dashboard',
            array( $this, 'render_dashboard_page' )
        );

        add_submenu_page(
            'popup-notice-dashboard',
            'همه اطلاعیه‌ها',
            'همه اطلاعیه‌ها',
            'manage_options',
            'popup-notice-list',
            array( $this, 'render_list_page' )
        );

        add_submenu_page(
            'popup-notice-dashboard',
            'افزودن / ویرایش اطلاعیه',
            'افزودن اطلاعیه جدید',
            'manage_options',
            'popup-notice-edit',
            array( $this, 'render_edit_page' )
        );
    }

    private function sanitize_notice_payload( array $input ): array {
        $id = ! empty( $input['id'] ) ? sanitize_text_field( wp_unslash( (string) $input['id'] ) ) : 'notice-' . time();

        $checkboxes = array(
            'enabled', 'show_icon', 'show_badge', 'show_title', 'show_subtitle',
            'require_checkbox', 'secondary_btn_enabled', 'inherit_theme_font',
            'prevent_backdrop_close', 'prevent_esc_close', 'hide_close_btn',
            'pt_post', 'pt_page', 'pt_product',
            'tax_category', 'tax_post_tag', 'tax_product_cat', 'tax_product_tag',
            'woo_shop', 'woo_product', 'woo_category', 'woo_cart', 'woo_checkout', 'woo_account'
        );

        $clean = array( 'id' => $id );
        foreach ( $checkboxes as $cb ) {
            $clean[ $cb ] = ! empty( $input[ $cb ] ) ? '1' : '0';
        }

        $text_fields = array(
            'internal_name', 'notice_version', 'icon_type', 'badge_text', 'title', 'subtitle',
            'checkbox_label', 'checkbox_error', 'accept_btn_text', 'secondary_btn_text',
            'style_preset', 'position', 'animation', 'primary_color', 'button_text_color',
            'accent_color', 'bg_color', 'text_color', 'subtitle_color', 'body_box_bg',
            'body_box_text', 'body_box_border', 'checkbox_box_bg', 'checkbox_box_text',
            'display_target', 'pt_custom', 'tax_terms', 'target_user_roles',
            'trigger_type', 'session_mode'
        );

        foreach ( $text_fields as $tf ) {
            $clean[ $tf ] = isset( $input[ $tf ] ) ? sanitize_text_field( wp_unslash( (string) $input[ $tf ] ) ) : '';
        }

        $clean['secondary_btn_url'] = isset( $input['secondary_btn_url'] ) ? esc_url_raw( wp_unslash( (string) $input['secondary_btn_url'] ) ) : '';
        $clean['banner_image_url']  = isset( $input['banner_image_url'] ) ? esc_url_raw( wp_unslash( (string) $input['banner_image_url'] ) ) : '';
        $clean['content_html']      = isset( $input['content_html'] ) ? wp_kses_post( wp_unslash( (string) $input['content_html'] ) ) : '';
        $clean['include_pages']     = isset( $input['include_pages'] ) ? sanitize_textarea_field( wp_unslash( (string) $input['include_pages'] ) ) : '';
        $clean['exclude_pages']     = isset( $input['exclude_pages'] ) ? sanitize_textarea_field( wp_unslash( (string) $input['exclude_pages'] ) ) : '';
        $clean['custom_css']        = isset( $input['custom_css'] ) ? wp_strip_all_tags( wp_unslash( (string) $input['custom_css'] ) ) : '';

        $int_fields = array(
            'priority' => 1, 'width_px' => 540, 'border_radius_px' => 20, 'backdrop_blur_px' => 12,
            'overlay_opacity' => 70, 'countdown_seconds' => 0, 'delay_seconds' => 3,
            'scroll_pixels' => 300, 'cookie_expire_days' => 30
        );
        foreach ( $int_fields as $if => $def ) {
            $clean[ $if ] = isset( $input[ $if ] ) ? absint( $input[ $if ] ) : $def;
        }

        return $clean;
    }

    /**
     * AJAX Save Notice (Stays on the edit page without redirecting!)
     */
    public function ajax_save_notice(): void {
        check_ajax_referer( 'pnp_admin_ajax_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( array( 'message' => 'دسترسی غیرمجاز' ) );
        }

        $raw_notice = isset( $_POST['notice'] ) && is_array( $_POST['notice'] ) ? $_POST['notice'] : array();
        $clean      = $this->sanitize_notice_payload( $raw_notice );
        $notices    = pnp_get_notices();

        $found = false;
        foreach ( $notices as $idx => $existing ) {
            if ( ( $existing['id'] ?? '' ) === $clean['id'] ) {
                $notices[ $idx ] = $clean;
                $found = true;
                break;
            }
        }
        if ( ! $found ) {
            $notices[] = $clean;
        }

        pnp_save_notices( $notices );
        wp_send_json_success( array(
            'message' => 'تغییرات اطلاعیه با موفقیت ذخیره شد (بدون خروج از صفحه).',
            'notice'  => $clean,
        ) );
    }

    public function ajax_toggle_notice(): void {
        check_ajax_referer( 'pnp_admin_ajax_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error();
        }
        $id      = isset( $_POST['id'] ) ? sanitize_text_field( wp_unslash( (string) $_POST['id'] ) ) : '';
        $notices = pnp_get_notices();
        $new_st  = '0';
        foreach ( $notices as &$n ) {
            if ( ( $n['id'] ?? '' ) === $id ) {
                $new_st       = ( '1' === (string) ( $n['enabled'] ?? '1' ) ) ? '0' : '1';
                $n['enabled'] = $new_st;
                break;
            }
        }
        pnp_save_notices( $notices );
        wp_send_json_success( array( 'enabled' => $new_st ) );
    }

    public function ajax_duplicate_notice(): void {
        check_ajax_referer( 'pnp_admin_ajax_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error();
        }
        $id      = isset( $_POST['id'] ) ? sanitize_text_field( wp_unslash( (string) $_POST['id'] ) ) : '';
        $notices = pnp_get_notices();
        foreach ( $notices as $n ) {
            if ( ( $n['id'] ?? '' ) === $id ) {
                $copy                  = $n;
                $copy['id']            = 'notice-' . time() . '-' . wp_rand( 10, 99 );
                $copy['internal_name'] = ( $n['internal_name'] ?? 'اطلاعیه' ) . ' (کپی)';
                $notices[]             = $copy;
                pnp_save_notices( $notices );
                wp_send_json_success( array( 'copy' => $copy ) );
            }
        }
        wp_send_json_error();
    }

    public function ajax_delete_notice(): void {
        check_ajax_referer( 'pnp_admin_ajax_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error();
        }
        $id      = isset( $_POST['id'] ) ? sanitize_text_field( wp_unslash( (string) $_POST['id'] ) ) : '';
        $notices = pnp_get_notices();
        $notices = array_filter( $notices, function( $n ) use ( $id ) {
            return ( $n['id'] ?? '' ) !== $id;
        } );
        pnp_save_notices( $notices );
        wp_send_json_success();
    }

    private function render_shared_admin_styles(): void {
        ?>
        <style>
            .pnp-admin-wrap {
                max-width: 1220px;
                margin: 22px auto;
                font-family: inherit;
                color: #0f172a;
            }
            .pnp-topbar {
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                color: #fff;
                padding: 24px 30px;
                border-radius: 18px;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;
                gap: 16px;
                margin-bottom: 24px;
                box-shadow: 0 15px 35px -10px rgba(15, 23, 42, 0.25);
            }
            .pnp-topbar h1 {
                color: #fff;
                margin: 0 0 6px 0;
                font-size: 22px;
                font-weight: 800;
            }
            .pnp-topbar p {
                margin: 0;
                color: #cbd5e1;
                font-size: 13px;
            }
            .pnp-nav-pills {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            .pnp-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 9px 18px;
                border-radius: 10px;
                font-size: 13px;
                font-weight: 700;
                text-decoration: none;
                cursor: pointer;
                border: 1px solid transparent;
                transition: all 0.2s ease;
            }
            .pnp-btn-primary {
                background: #2563eb;
                color: #fff !important;
            }
            .pnp-btn-primary:hover {
                background: #1d4ed8;
            }
            .pnp-btn-secondary {
                background: rgba(255, 255, 255, 0.12);
                color: #fff !important;
                border-color: rgba(255, 255, 255, 0.22);
            }
            .pnp-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            .pnp-btn-light {
                background: #f1f5f9;
                color: #1e293b !important;
                border-color: #cbd5e1;
            }
            .pnp-btn-light:hover {
                background: #e2e8f0;
            }
            .pnp-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
                gap: 18px;
                margin-bottom: 24px;
            }
            .pnp-stat-card {
                background: #fff;
                padding: 22px;
                border-radius: 16px;
                border: 1px solid #e2e8f0;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
            }
            .pnp-stat-card .pnp-stat-label {
                font-size: 13px;
                color: #64748b;
                font-weight: 600;
                margin-bottom: 8px;
            }
            .pnp-stat-card .pnp-stat-value {
                font-size: 28px;
                font-weight: 800;
                color: #0f172a;
            }
            .pnp-card {
                background: #fff;
                border-radius: 16px;
                padding: 26px;
                border: 1px solid #e2e8f0;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
                margin-bottom: 24px;
            }
            .pnp-toast {
                position: fixed;
                bottom: 28px;
                left: 28px;
                background: #0f172a;
                color: #fff;
                padding: 14px 22px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 700;
                box-shadow: 0 15px 30px rgba(0,0,0,0.25);
                border-right: 4px solid #10b981;
                z-index: 999999;
                display: none;
            }
            .pnp-harmony-chip {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 7px 14px;
                border-radius: 10px;
                background: #f8fafc;
                border: 1px solid #cbd5e1;
                cursor: pointer;
                font-size: 12px;
                font-weight: 700;
                margin-left: 8px;
                margin-bottom: 8px;
            }
            .pnp-harmony-chip:hover {
                border-color: #2563eb;
                background: #eff6ff;
            }
        </style>
        <div id="pnp-ajax-toast" class="pnp-toast"></div>
        <?php
    }

    /**
     * Submenu 1: Dashboard & Statistics Overview
     */
    public function render_dashboard_page(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }
        $notices       = pnp_get_notices();
        $total_count   = count( $notices );
        $active_count  = 0;
        $session_count = 0;
        $delayed_count = 0;

        foreach ( $notices as $n ) {
            if ( '1' === (string) ( $n['enabled'] ?? '0' ) ) {
                $active_count++;
            }
            if ( 'every_session' === ( $n['session_mode'] ?? '' ) ) {
                $session_count++;
            }
            if ( in_array( $n['trigger_type'] ?? '', array( 'delay_seconds', 'scroll_pixels' ), true ) ) {
                $delayed_count++;
            }
        }
        $inactive_count = $total_count - $active_count;
        ?>
        <div class="wrap pnp-admin-wrap" dir="rtl">
            <?php $this->render_shared_admin_styles(); ?>

            <div class="pnp-topbar">
                <div>
                    <h1>پیشخوان و آمار اطلاع رسانی پاپ آپ</h1>
                    <p>نمای کلی وضعیت اطلاعیه‌ها، شروط نمایش، شورت‌کدها و عملکرد سیستم</p>
                </div>
                <div class="pnp-nav-pills">
                    <a href="<?php echo esc_url( admin_url( 'admin.php?page=popup-notice-list' ) ); ?>" class="pnp-btn pnp-btn-secondary">
                        لیست همه اطلاعیه‌ها (<?php echo esc_html( (string) $total_count ); ?>)
                    </a>
                    <a href="<?php echo esc_url( admin_url( 'admin.php?page=popup-notice-edit' ) ); ?>" class="pnp-btn pnp-btn-primary">
                        + افزودن اطلاعیه جدید
                    </a>
                </div>
            </div>

            <div class="pnp-stats-grid">
                <div class="pnp-stat-card">
                    <div class="pnp-stat-label">تعداد کل اطلاعیه‌ها</div>
                    <div class="pnp-stat-value"><?php echo esc_html( (string) $total_count ); ?></div>
                </div>
                <div class="pnp-stat-card" style="border-bottom: 3px solid #16a34a;">
                    <div class="pnp-stat-label">اطلاعیه‌های فعال در سایت</div>
                    <div class="pnp-stat-value" style="color: #16a34a;"><?php echo esc_html( (string) $active_count ); ?></div>
                </div>
                <div class="pnp-stat-card" style="border-bottom: 3px solid #94a3b8;">
                    <div class="pnp-stat-label">اطلاعیه‌های غیرفعال</div>
                    <div class="pnp-stat-value" style="color: #64748b;"><?php echo esc_html( (string) $inactive_count ); ?></div>
                </div>
                <div class="pnp-stat-card" style="border-bottom: 3px solid #2563eb;">
                    <div class="pnp-stat-label">نمایش در هر سشن / زمان‌دار</div>
                    <div class="pnp-stat-value" style="color: #2563eb;"><?php echo esc_html( (string) ( $session_count + $delayed_count ) ); ?></div>
                </div>
            </div>

            <div class="pnp-card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <h2 style="margin:0;font-size:17px;">دسترسی سریع به اطلاعیه‌ها و شورت‌کدهای فراخوانی</h2>
                    <a href="<?php echo esc_url( admin_url( 'admin.php?page=popup-notice-list' ) ); ?>" class="pnp-btn pnp-btn-light">مدیریت کامل لیست &larr;</a>
                </div>
                <table class="widefat striped" style="border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
                    <thead>
                        <tr>
                            <th>اولویت</th>
                            <th>نام اطلاعیه</th>
                            <th>وضعیت</th>
                            <th>زمان نمایش (Trigger)</th>
                            <th>شورت‌کد فراخوانی در هر مکان</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ( $notices as $n ) :
                            $id = $n['id'] ?? '';
                            $edit_url = admin_url( 'admin.php?page=popup-notice-edit&notice_id=' . rawurlencode( $id ) );
                        ?>
                            <tr>
                                <td><strong>#<?php echo esc_html( (string) ( $n['priority'] ?? 1 ) ); ?></strong></td>
                                <td><strong><?php echo esc_html( $n['internal_name'] ?? '' ); ?></strong></td>
                                <td>
                                    <?php if ( '1' === (string) ( $n['enabled'] ?? '1' ) ) : ?>
                                        <span style="color:#16a34a;font-weight:bold;">● فعال</span>
                                    <?php else : ?>
                                        <span style="color:#94a3b8;font-weight:bold;">○ غیرفعال</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php
                                    $trig = $n['trigger_type'] ?? 'immediate';
                                    if ( 'delay_seconds' === $trig ) {
                                        echo 'بعد از ' . esc_html( (string) ( $n['delay_seconds'] ?? 3 ) ) . ' ثانیه';
                                    } elseif ( 'scroll_pixels' === $trig ) {
                                        echo 'بعد از ' . esc_html( (string) ( $n['scroll_pixels'] ?? 300 ) ) . ' پیکسل اسکرول';
                                    } elseif ( 'exit_intent' === $trig ) {
                                        echo 'هنگام قصد خروج';
                                    } else {
                                        echo 'نمایش فوری';
                                    }
                                    ?>
                                </td>
                                <td><code dir="ltr">[popup_notice id="<?php echo esc_attr( $id ); ?>"]</code></td>
                                <td><a href="<?php echo esc_url( $edit_url ); ?>" class="button button-small button-primary">ویرایش</a></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
        <?php
    }

    /**
     * Submenu 2: Full AJAX Notices List Page
     */
    public function render_list_page(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }
        $notices    = pnp_get_notices();
        $ajax_nonce = wp_create_nonce( 'pnp_admin_ajax_nonce' );
        ?>
        <div class="wrap pnp-admin-wrap" dir="rtl">
            <?php $this->render_shared_admin_styles(); ?>

            <div class="pnp-topbar">
                <div>
                    <h1>همه اطلاعیه‌های پاپ‌آپ</h1>
                    <p>مدیریت ایجکس (AJAX) اطلاعیه‌ها، تغییر وضعیت آنی، کپی و شورت‌کد اختصاصی</p>
                </div>
                <div class="pnp-nav-pills">
                    <a href="<?php echo esc_url( admin_url( 'admin.php?page=popup-notice-dashboard' ) ); ?>" class="pnp-btn pnp-btn-secondary">
                        داشبورد و آمار
                    </a>
                    <a href="<?php echo esc_url( admin_url( 'admin.php?page=popup-notice-edit' ) ); ?>" class="pnp-btn pnp-btn-primary">
                        + افزودن اطلاعیه جدید
                    </a>
                </div>
            </div>

            <div class="pnp-card">
                <table class="widefat striped" style="border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
                    <thead>
                        <tr>
                            <th style="padding:14px;">اولویت</th>
                            <th style="padding:14px;">نام و عنوان اطلاعیه</th>
                            <th style="padding:14px;">وضعیت (ایجکس)</th>
                            <th style="padding:14px;">نحوه و زمان نمایش</th>
                            <th style="padding:14px;">پست‌تایپ / مکان نمایش</th>
                            <th style="padding:14px;">شورت‌کد</th>
                            <th style="padding:14px;">عملیات</th>
                        </tr>
                    </thead>
                    <tbody id="pnp-notices-tbody">
                        <?php foreach ( $notices as $n ) :
                            $id         = $n['id'] ?? '';
                            $is_enabled = '1' === (string) ( $n['enabled'] ?? '1' );
                            $edit_url   = admin_url( 'admin.php?page=popup-notice-edit&notice_id=' . rawurlencode( $id ) );
                        ?>
                            <tr id="pnp-row-<?php echo esc_attr( $id ); ?>">
                                <td style="padding:14px;font-weight:bold;color:#2563eb;">#<?php echo esc_html( (string) ( $n['priority'] ?? 1 ) ); ?></td>
                                <td style="padding:14px;">
                                    <strong style="font-size:14px;display:block;margin-bottom:3px;">
                                        <a href="<?php echo esc_url( $edit_url ); ?>" style="text-decoration:none;color:#0f172a;"><?php echo esc_html( $n['internal_name'] ?? '' ); ?></a>
                                    </strong>
                                    <span style="font-size:12px;color:#64748b;"><?php echo esc_html( $n['title'] ?? '' ); ?></span>
                                </td>
                                <td style="padding:14px;">
                                    <button type="button" class="button pnp-ajax-toggle" data-id="<?php echo esc_attr( $id ); ?>" style="font-weight:bold;color:<?php echo $is_enabled ? '#16a34a' : '#64748b'; ?>;">
                                        <?php echo $is_enabled ? '● فعال' : '○ غیرفعال'; ?>
                                    </button>
                                </td>
                                <td style="padding:14px;font-size:12px;">
                                    <?php
                                    $sm = $n['session_mode'] ?? 'every_session';
                                    echo 'every_session' === $sm ? 'در هر سشن' : ( 'every_pageload' === $sm ? 'هر بار لود' : 'کوکی (' . esc_html( (string) ( $n['cookie_expire_days'] ?? 30 ) ) . ' روز)' );
                                    echo ' · ';
                                    $trig = $n['trigger_type'] ?? 'immediate';
                                    if ( 'delay_seconds' === $trig ) {
                                        echo 'بعد از ' . esc_html( (string) ( $n['delay_seconds'] ?? 3 ) ) . ' ثانیه';
                                    } elseif ( 'scroll_pixels' === $trig ) {
                                        echo 'اسکرول ' . esc_html( (string) ( $n['scroll_pixels'] ?? 300 ) ) . 'px';
                                    } else {
                                        echo 'فوری';
                                    }
                                    ?>
                                </td>
                                <td style="padding:14px;font-size:12px;">
                                    <?php echo esc_html( $n['display_target'] ?? 'all_pages' ); ?>
                                </td>
                                <td style="padding:14px;">
                                    <code dir="ltr" style="font-size:11px;">[popup_notice id="<?php echo esc_attr( $id ); ?>"]</code>
                                </td>
                                <td style="padding:14px;">
                                    <div style="display:flex;gap:6px;">
                                        <a href="<?php echo esc_url( $edit_url ); ?>" class="button button-small button-primary">ویرایش</a>
                                        <button type="button" class="button button-small pnp-ajax-dup" data-id="<?php echo esc_attr( $id ); ?>">کپی</button>
                                        <button type="button" class="button button-small pnp-ajax-del" data-id="<?php echo esc_attr( $id ); ?>" style="color:#dc2626;border-color:#fca5a5;">حذف</button>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <script>
            (function(){
                var nonce = '<?php echo esc_js( $ajax_nonce ); ?>';
                function showToast(msg) {
                    var t = document.getElementById('pnp-ajax-toast');
                    if (!t) return;
                    t.textContent = msg;
                    t.style.display = 'block';
                    setTimeout(function(){ t.style.display = 'none'; }, 3000);
                }

                document.querySelectorAll('.pnp-ajax-toggle').forEach(function(btn){
                    btn.addEventListener('click', function(){
                        var id = btn.getAttribute('data-id');
                        var fd = new FormData();
                        fd.append('action', 'pnp_ajax_toggle_notice');
                        fd.append('nonce', nonce);
                        fd.append('id', id);
                        fetch(ajaxurl, { method: 'POST', body: fd })
                            .then(function(r){ return r.json(); })
                            .then(function(res){
                                if (res.success) {
                                    var en = res.data.enabled === '1';
                                    btn.textContent = en ? '● فعال' : '○ غیرفعال';
                                    btn.style.color = en ? '#16a34a' : '#64748b';
                                    showToast('وضعیت اطلاعیه به صورت ایجکس بروزرسانی شد.');
                                }
                            });
                    });
                });

                document.querySelectorAll('.pnp-ajax-del').forEach(function(btn){
                    btn.addEventListener('click', function(){
                        if (!confirm('آیا از حذف این اطلاعیه اطمینان دارید؟')) return;
                        var id = btn.getAttribute('data-id');
                        var fd = new FormData();
                        fd.append('action', 'pnp_ajax_delete_notice');
                        fd.append('nonce', nonce);
                        fd.append('id', id);
                        fetch(ajaxurl, { method: 'POST', body: fd })
                            .then(function(r){ return r.json(); })
                            .then(function(res){
                                if (res.success) {
                                    var row = document.getElementById('pnp-row-' + id);
                                    if (row) row.remove();
                                    showToast('اطلاعیه با موفقیت حذف شد.');
                                }
                            });
                    });
                });

                document.querySelectorAll('.pnp-ajax-dup').forEach(function(btn){
                    btn.addEventListener('click', function(){
                        var id = btn.getAttribute('data-id');
                        var fd = new FormData();
                        fd.append('action', 'pnp_ajax_duplicate_notice');
                        fd.append('nonce', nonce);
                        fd.append('id', id);
                        fetch(ajaxurl, { method: 'POST', body: fd })
                            .then(function(r){ return r.json(); })
                            .then(function(res){
                                if (res.success) {
                                    showToast('کپی اطلاعیه ساخته شد. در حال بروزرسانی لیست...');
                                    setTimeout(function(){ window.location.reload(); }, 600);
                                }
                            });
                    });
                });
            })();
            </script>
        </div>
        <?php
    }

    /**
     * Submenu 3: Modern AJAX Notice Editor (Stays on page when saving + Back button!)
     */
    public function render_edit_page(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }
        $notices    = pnp_get_notices();
        $notice_id  = isset( $_GET['notice_id'] ) ? sanitize_text_field( wp_unslash( (string) $_GET['notice_id'] ) ) : '';
        $ajax_nonce = wp_create_nonce( 'pnp_admin_ajax_nonce' );

        $n = null;
        if ( $notice_id ) {
            foreach ( $notices as $item ) {
                if ( ( $item['id'] ?? '' ) === $notice_id ) {
                    $n = $item;
                    break;
                }
            }
        }
        if ( ! $n ) {
            $defaults           = pnp_get_default_notices();
            $n                  = $defaults[0];
            $n['id']            = 'notice-' . time();
            $n['internal_name'] = 'اطلاعیه جدید ' . ( count( $notices ) + 1 );
            $n['priority']      = count( $notices ) + 1;
        }
        ?>
        <div class="wrap pnp-admin-wrap" dir="rtl">
            <?php $this->render_shared_admin_styles(); ?>

            <div class="pnp-topbar">
                <div>
                    <h1>ویرایش و تنظیمات اطلاعیه پاپ‌آپ</h1>
                    <p>ذخیره‌سازی آنی با ایجکس (بدون خروج از صفحه) · شورت‌کد اختصاصی: <code dir="ltr" style="color:#38bdf8;">[popup_notice id="<?php echo esc_attr( $n['id'] ); ?>"]</code></p>
                </div>
                <div class="pnp-nav-pills">
                    <a href="<?php echo esc_url( admin_url( 'admin.php?page=popup-notice-list' ) ); ?>" class="pnp-btn pnp-btn-secondary">
                        &rarr; بازگشت به لیست اطلاعیه‌ها
                    </a>
                    <button type="button" id="pnp-top-save-btn" class="pnp-btn pnp-btn-primary">
                        ذخیره تغییرات اطلاعیه (AJAX)
                    </button>
                </div>
            </div>

            <form id="pnp-notice-edit-form" class="pnp-card">
                <input type="hidden" name="notice[id]" value="<?php echo esc_attr( $n['id'] ); ?>" />

                <h2 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">۱. محتوا، آیکون و کنترل نمایش سرتیتر و عناوین</h2>
                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row">وضعیت، نام داخلی و اولویت</th>
                        <td>
                            <label style="margin-left:20px;">
                                <input type="checkbox" name="notice[enabled]" value="1" <?php checked( '1', $n['enabled'] ?? '1' ); ?> />
                                <strong>فعال بودن این اطلاعیه</strong>
                            </label>
                            نام داخلی:
                            <input type="text" name="notice[internal_name]" value="<?php echo esc_attr( $n['internal_name'] ?? '' ); ?>" class="regular-text" />
                            &nbsp;&nbsp;اولویت:
                            <input type="number" name="notice[priority]" value="<?php echo esc_attr( (string) ( $n['priority'] ?? 1 ) ); ?>" style="width:70px;" />
                            &nbsp;&nbsp;نسخه:
                            <input type="text" name="notice[notice_version]" value="<?php echo esc_attr( $n['notice_version'] ?? '3.0.0' ); ?>" style="width:90px;" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">آیکون بالای پاپ‌آپ (SVG)</th>
                        <td>
                            <label style="margin-left:16px;">
                                <input type="checkbox" name="notice[show_icon]" value="1" <?php checked( '1', $n['show_icon'] ?? '1' ); ?> />
                                نمایش آیکون در هدر
                            </label>
                            <select name="notice[icon_type]">
                                <option value="shield" <?php selected( 'shield', $n['icon_type'] ?? 'shield' ); ?>>سپر امنیتی و قوانین (Shield)</option>
                                <option value="bell" <?php selected( 'bell', $n['icon_type'] ?? '' ); ?>>زنگوله اطلاع‌رسانی (Bell)</option>
                                <option value="cart" <?php selected( 'cart', $n['icon_type'] ?? '' ); ?>>سبد خرید ووکامرس (Cart)</option>
                                <option value="alert" <?php selected( 'alert', $n['icon_type'] ?? '' ); ?>>هشدار مهم (Alert)</option>
                                <option value="check" <?php selected( 'check', $n['icon_type'] ?? '' ); ?>>تاییدیه رسمی (Check)</option>
                                <option value="sparkles" <?php selected( 'sparkles', $n['icon_type'] ?? '' ); ?>>ستاره ویژه (Sparkles)</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">سرتیتر بالای عنوان (Kicker)</th>
                        <td>
                            <label style="display:block;margin-bottom:6px;">
                                <input type="checkbox" name="notice[show_badge]" value="1" <?php checked( '1', $n['show_badge'] ?? '1' ); ?> />
                                فعال‌سازی نمایش سرتیتر بالای عنوان
                            </label>
                            <input type="text" name="notice[badge_text]" value="<?php echo esc_attr( $n['badge_text'] ?? '' ); ?>" class="regular-text" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">عنوان اصلی اطلاعیه</th>
                        <td>
                            <label style="display:block;margin-bottom:6px;">
                                <input type="checkbox" name="notice[show_title]" value="1" <?php checked( '1', $n['show_title'] ?? '1' ); ?> />
                                فعال‌سازی نمایش عنوان اصلی
                            </label>
                            <input type="text" name="notice[title]" value="<?php echo esc_attr( $n['title'] ?? '' ); ?>" class="large-text" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">زیرعنوان توضیحی</th>
                        <td>
                            <label style="display:block;margin-bottom:6px;">
                                <input type="checkbox" name="notice[show_subtitle]" value="1" <?php checked( '1', $n['show_subtitle'] ?? '1' ); ?> />
                                فعال‌سازی نمایش زیرعنوان
                            </label>
                            <input type="text" name="notice[subtitle]" value="<?php echo esc_attr( $n['subtitle'] ?? '' ); ?>" class="large-text" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">متن کامل اطلاعیه</th>
                        <td>
                            <textarea name="notice[content_html]" id="pnp-content-html" rows="6" class="large-text"><?php echo esc_textarea( $n['content_html'] ?? '' ); ?></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">تیک اجباری و دکمه‌ها</th>
                        <td>
                            <label style="display:block;margin-bottom:8px;">
                                <input type="checkbox" name="notice[require_checkbox]" value="1" <?php checked( '1', $n['require_checkbox'] ?? '1' ); ?> />
                                الزام کاربر به زدن تیک «متن اطلاعیه را خواندم و متوجه شدم»
                            </label>
                            متن چک‌باکس: <input type="text" name="notice[checkbox_label]" value="<?php echo esc_attr( $n['checkbox_label'] ?? '' ); ?>" class="large-text" style="margin-bottom:8px;" />
                            متن خطا: <input type="text" name="notice[checkbox_error]" value="<?php echo esc_attr( $n['checkbox_error'] ?? '' ); ?>" class="large-text" style="margin-bottom:8px;" />
                            متن دکمه تایید: <input type="text" name="notice[accept_btn_text]" value="<?php echo esc_attr( $n['accept_btn_text'] ?? '' ); ?>" class="regular-text" />
                        </td>
                    </tr>
                </table>

                <h2 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-top: 26px;">۲. پروفایل استایل و پیشنهادهای رنگی هوشمند با خوانایی ۱۰۰٪</h2>
                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row">پروفایل استایل و رنگ</th>
                        <td>
                            <select name="notice[style_preset]" id="pnp-style-preset-select">
                                <option value="corporate-minimal" <?php selected( 'corporate-minimal', $n['style_preset'] ?? '' ); ?>>مینیمال روشن رسمی (Corporate Light)</option>
                                <option value="glassmorphism" <?php selected( 'glassmorphism', $n['style_preset'] ?? '' ); ?>>شیشه‌ای کریستالی تیره (Glassmorphism)</option>
                                <option value="luxury-dark" <?php selected( 'luxury-dark', $n['style_preset'] ?? '' ); ?>>دارک رویال طلایی (Luxury Gold)</option>
                                <option value="woo-checkout" <?php selected( 'woo-checkout', $n['style_preset'] ?? '' ); ?>>فروشگاهی ووکامرس روشن (WooCommerce Clean)</option>
                                <option value="cyber-neon" <?php selected( 'cyber-neon', $n['style_preset'] ?? '' ); ?>>هشدار زمردی تیره (Cyber Emerald)</option>
                                <option value="emerald-light" <?php selected( 'emerald-light', $n['style_preset'] ?? '' ); ?>>سبز مدرن روشن (Fresh Trust Light)</option>
                            </select>
                            <div id="pnp-recommended-harmonies" style="margin-top:12px;"></div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">رنگ‌های پاپ‌آپ</th>
                        <td>
                            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;">
                                <label>پس‌زمینه پاپ‌آپ:<br/><input type="color" id="pnp_bg_color" name="notice[bg_color]" value="<?php echo esc_attr( $n['bg_color'] ?? '#ffffff' ); ?>" /></label>
                                <label>رنگ عنوان اصلی:<br/><input type="color" id="pnp_text_color" name="notice[text_color]" value="<?php echo esc_attr( $n['text_color'] ?? '#0f172a' ); ?>" /></label>
                                <label>رنگ زیرعنوان:<br/><input type="color" id="pnp_subtitle_color" name="notice[subtitle_color]" value="<?php echo esc_attr( $n['subtitle_color'] ?? '#475569' ); ?>" /></label>
                                <label>پس‌زمینه کادر متن:<br/><input type="color" id="pnp_body_box_bg" name="notice[body_box_bg]" value="<?php echo esc_attr( $n['body_box_bg'] ?? '#f8fafc' ); ?>" /></label>
                                <label>رنگ متن داخل کادر:<br/><input type="color" id="pnp_body_box_text" name="notice[body_box_text]" value="<?php echo esc_attr( $n['body_box_text'] ?? '#1e293b' ); ?>" /></label>
                                <label>حاشیه کادر متن:<br/><input type="color" id="pnp_body_box_border" name="notice[body_box_border]" value="<?php echo esc_attr( $n['body_box_border'] ?? '#e2e8f0' ); ?>" /></label>
                                <label>پس‌زمینه چک‌باکس:<br/><input type="color" id="pnp_checkbox_box_bg" name="notice[checkbox_box_bg]" value="<?php echo esc_attr( $n['checkbox_box_bg'] ?? '#eff6ff' ); ?>" /></label>
                                <label>رنگ متن چک‌باکس:<br/><input type="color" id="pnp_checkbox_box_text" name="notice[checkbox_box_text]" value="<?php echo esc_attr( $n['checkbox_box_text'] ?? '#0f172a' ); ?>" /></label>
                                <label>رنگ دکمه و آیکون:<br/><input type="color" id="pnp_primary_color" name="notice[primary_color]" value="<?php echo esc_attr( $n['primary_color'] ?? '#2563eb' ); ?>" /></label>
                                <label>رنگ متن دکمه:<br/><input type="color" id="pnp_button_text_color" name="notice[button_text_color]" value="<?php echo esc_attr( $n['button_text_color'] ?? '#ffffff' ); ?>" /></label>
                                <label>رنگ سرتیتر:<br/><input type="color" id="pnp_accent_color" name="notice[accent_color]" value="<?php echo esc_attr( $n['accent_color'] ?? '#1d4ed8' ); ?>" /></label>
                            </div>
                        </td>
                    </tr>
                </table>

                <h2 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-top: 26px;">۳. تنظیمات نمایش در هر سشن، تاخیر ثانیه‌ای و اسکرول پیکسلی</h2>
                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row">نحوه تکرار نمایش (Session / Cookie)</th>
                        <td>
                            <select name="notice[session_mode]">
                                <option value="every_session" <?php selected( 'every_session', $n['session_mode'] ?? 'every_session' ); ?>>نمایش در هر سشن (Session - با بستن و باز کردن مرورگر مجدد نمایش داده شود)</option>
                                <option value="cookie_days" <?php selected( 'cookie_days', $n['session_mode'] ?? '' ); ?>>عدم نمایش تا زمان انقضای کوکی (بر اساس تعداد روز)</option>
                                <option value="every_pageload" <?php selected( 'every_pageload', $n['session_mode'] ?? '' ); ?>>نمایش در هر بار بارگذاری صفحه</option>
                            </select>
                            &nbsp;&nbsp;مدت کوکی:
                            <input type="number" name="notice[cookie_expire_days]" value="<?php echo esc_attr( (string) ( $n['cookie_expire_days'] ?? 30 ) ); ?>" style="width:70px;" /> روز
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">زمان باز شدن پاپ‌آپ (ثانیه / اسکرول پیکسل)</th>
                        <td>
                            <select name="notice[trigger_type]">
                                <option value="immediate" <?php selected( 'immediate', $n['trigger_type'] ?? '' ); ?>>نمایش فوری به محض لود صفحه</option>
                                <option value="delay_seconds" <?php selected( 'delay_seconds', $n['trigger_type'] ?? 'delay_seconds' ); ?>>نمایش بعد از N ثانیه (مثلاً ۳ ثانیه)</option>
                                <option value="scroll_pixels" <?php selected( 'scroll_pixels', $n['trigger_type'] ?? '' ); ?>>نمایش بعد از N پیکسل اسکرول (مثلاً ۳۰۰ پیکسل)</option>
                                <option value="exit_intent" <?php selected( 'exit_intent', $n['trigger_type'] ?? '' ); ?>>هنگام قصد خروج کاربر از صفحه</option>
                            </select>
                            <div style="margin-top:10px;">
                                نمایش بعد از: <input type="number" name="notice[delay_seconds]" value="<?php echo esc_attr( (string) ( $n['delay_seconds'] ?? 3 ) ); ?>" style="width:75px;" /> <strong>ثانیه</strong>
                                &nbsp;&nbsp;|&nbsp;&nbsp;
                                یا نمایش بعد از: <input type="number" name="notice[scroll_pixels]" value="<?php echo esc_attr( (string) ( $n['scroll_pixels'] ?? 300 ) ); ?>" style="width:90px;" /> <strong>پیکسل اسکرول</strong>
                            </div>
                        </td>
                    </tr>
                </table>

                <h2 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-top: 26px;">۴. فراخوانی بر اساس پست‌تایپ، تکسونومی، آدرس و شورت‌کد</h2>
                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row">حالت کلی مکان نمایش</th>
                        <td>
                            <select name="notice[display_target]">
                                <option value="all_pages" <?php selected( 'all_pages', $n['display_target'] ?? '' ); ?>>تمامی صفحات سایت</option>
                                <option value="homepage_only" <?php selected( 'homepage_only', $n['display_target'] ?? '' ); ?>>فقط صفحه اصلی سایت</option>
                                <option value="woo_all" <?php selected( 'woo_all', $n['display_target'] ?? '' ); ?>>تمامی برگه‌های ووکامرس</option>
                                <option value="woo_shop_product" <?php selected( 'woo_shop_product', $n['display_target'] ?? '' ); ?>>فقط فروشگاه و محصولات ووکامرس</option>
                                <option value="woo_checkout_cart" <?php selected( 'woo_checkout_cart', $n['display_target'] ?? '' ); ?>>فقط سبد خرید و تسویه‌حساب ووکامرس</option>
                                <option value="advanced_rules" <?php selected( 'advanced_rules', $n['display_target'] ?? '' ); ?>>انتخاب پیشرفته بر اساس پست‌تایپ، تکسونومی، آدرس یا آیدی</option>
                                <option value="shortcode_only" <?php selected( 'shortcode_only', $n['display_target'] ?? '' ); ?>>فقط فراخوانی با شورت‌کد یا تابع PHP در مکان دلخواه</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">انتخاب پست‌تایپ‌ها (Post Types)</th>
                        <td>
                            <label style="margin-left:16px;"><input type="checkbox" name="notice[pt_post]" value="1" <?php checked( '1', $n['pt_post'] ?? '0' ); ?> /> نوشته‌ها (post)</label>
                            <label style="margin-left:16px;"><input type="checkbox" name="notice[pt_page]" value="1" <?php checked( '1', $n['pt_page'] ?? '0' ); ?> /> برگه‌ها (page)</label>
                            <label style="margin-left:16px;"><input type="checkbox" name="notice[pt_product]" value="1" <?php checked( '1', $n['pt_product'] ?? '0' ); ?> /> محصولات ووکامرس (product)</label>
                            <br/><br/>
                            نامک پست‌تایپ‌های سفارشی دیگر (با کاما جدا کنید):
                            <input type="text" name="notice[pt_custom]" value="<?php echo esc_attr( $n['pt_custom'] ?? '' ); ?>" placeholder="portfolio, course, event" dir="ltr" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">انتخاب تکسونومی و دسته‌بندی‌ها</th>
                        <td>
                            <label style="margin-left:16px;"><input type="checkbox" name="notice[tax_category]" value="1" <?php checked( '1', $n['tax_category'] ?? '0' ); ?> /> دسته‌بندی نوشته‌ها (category)</label>
                            <label style="margin-left:16px;"><input type="checkbox" name="notice[tax_post_tag]" value="1" <?php checked( '1', $n['tax_post_tag'] ?? '0' ); ?> /> برچسب نوشته‌ها (post_tag)</label>
                            <label style="margin-left:16px;"><input type="checkbox" name="notice[tax_product_cat]" value="1" <?php checked( '1', $n['tax_product_cat'] ?? '0' ); ?> /> دسته‌بندی محصولات (product_cat)</label>
                            <label><input type="checkbox" name="notice[tax_product_tag]" value="1" <?php checked( '1', $n['tax_product_tag'] ?? '0' ); ?> /> برچسب محصولات (product_tag)</label>
                            <br/><br/>
                            آیدی یا اسلاگ دسته‌های خاص (اختیاری - با کاما جدا کنید):
                            <input type="text" name="notice[tax_terms]" value="<?php echo esc_attr( $n['tax_terms'] ?? '' ); ?>" class="regular-text" dir="ltr" placeholder="news, vip-products, 18" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">آدرس URL یا آیدی‌های خاص (Include / Exclude)</th>
                        <td>
                            آدرس‌ها یا آیدی‌های شامل (Include):<br/>
                            <textarea name="notice[include_pages]" rows="2" class="large-text" dir="ltr"><?php echo esc_textarea( $n['include_pages'] ?? '' ); ?></textarea>
                            <br/>آدرس‌ها یا آیدی‌های مستثنی (Exclude):<br/>
                            <textarea name="notice[exclude_pages]" rows="2" class="large-text" dir="ltr"><?php echo esc_textarea( $n['exclude_pages'] ?? '' ); ?></textarea>
                        </td>
                    </tr>
                </table>

                <div style="display:flex;justify-content:space-between;align-items:center;padding-top:20px;border-top:2px solid #f1f5f9;margin-top:20px;">
                    <a href="<?php echo esc_url( admin_url( 'admin.php?page=popup-notice-list' ) ); ?>" class="pnp-btn pnp-btn-light">
                        &rarr; بازگشت به لیست اطلاعیه‌ها
                    </a>
                    <button type="submit" id="pnp-bottom-save-btn" class="pnp-btn pnp-btn-primary" style="padding:12px 28px;font-size:14px;">
                        ذخیره تغییرات اطلاعیه (بدون خروج از صفحه)
                    </button>
                </div>
            </form>

            <script>
            (function(){
                var presetsData = <?php echo $presetsDataJson; ?>;
                var select = document.getElementById('pnp-style-preset-select');
                var harmoniesBox = document.getElementById('pnp-recommended-harmonies');
                var form = document.getElementById('pnp-notice-edit-form');
                var topSaveBtn = document.getElementById('pnp-top-save-btn');
                var bottomSaveBtn = document.getElementById('pnp-bottom-save-btn');
                var nonce = '<?php echo esc_js( $ajax_nonce ); ?>';

                function showToast(msg) {
                    var t = document.getElementById('pnp-ajax-toast');
                    if (!t) return;
                    t.textContent = msg;
                    t.style.display = 'block';
                    setTimeout(function(){ t.style.display = 'none'; }, 3500);
                }

                function applyPalette(p) {
                    if (!p) return;
                    var map = {
                        'pnp_bg_color': p.backgroundColor,
                        'pnp_text_color': p.textColor,
                        'pnp_subtitle_color': p.subtitleColor,
                        'pnp_body_box_bg': p.bodyBoxBg,
                        'pnp_body_box_text': p.bodyBoxText,
                        'pnp_body_box_border': p.bodyBoxBorder,
                        'pnp_checkbox_box_bg': p.checkboxBoxBg,
                        'pnp_checkbox_box_text': p.checkboxBoxText,
                        'pnp_primary_color': p.primaryColor,
                        'pnp_button_text_color': p.buttonTextColor,
                        'pnp_accent_color': p.accentColor
                    };
                    Object.keys(map).forEach(function(id){
                        var el = document.getElementById(id);
                        if (el && map[id]) el.value = map[id];
                    });
                }

                function renderHarmonies(presetId) {
                    if (!harmoniesBox || !presetsData[presetId]) return;
                    var list = presetsData[presetId].harmonies || [];
                    harmoniesBox.innerHTML = '<div style="font-size:12px;font-weight:bold;margin-bottom:6px;color:#475569;">رنگ‌های پیشنهادی مکمل برای این پروفایل (کلیک جهت اعمال):</div>';
                    list.forEach(function(h){
                        var btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = 'pnp-harmony-chip';
                        btn.innerHTML = '<span style="width:14px;height:14px;border-radius:50%;background:' + h.primaryColor + ';display:inline-block;"></span>' +
                                        '<span style="width:14px;height:14px;border-radius:50%;background:' + h.backgroundColor + ';border:1px solid #94a3b8;display:inline-block;"></span>' +
                                        '<span>' + (h.name || 'پالت پیشنهادی') + '</span>';
                        btn.addEventListener('click', function(){
                            applyPalette(h);
                            showToast('پالت رنگی پیشنهادی «' + (h.name || '') + '» اعمال شد.');
                        });
                        harmoniesBox.appendChild(btn);
                    });
                }

                if (select) {
                    renderHarmonies(select.value);
                    select.addEventListener('change', function(){
                        var data = presetsData[select.value];
                        if (data && data.palette) {
                            applyPalette(data.palette);
                            renderHarmonies(select.value);
                        }
                    });
                }

                function submitAjaxSave(e) {
                    if (e) e.preventDefault();
                    var fd = new FormData(form);
                    fd.append('action', 'pnp_ajax_save_notice');
                    fd.append('nonce', nonce);

                    if (topSaveBtn) topSaveBtn.textContent = 'در حال ذخیره...';
                    if (bottomSaveBtn) bottomSaveBtn.textContent = 'در حال ذخیره...';

                    fetch(ajaxurl, { method: 'POST', body: fd })
                        .then(function(r){ return r.json(); })
                        .then(function(res){
                            if (topSaveBtn) topSaveBtn.textContent = 'ذخیره تغییرات اطلاعیه (AJAX)';
                            if (bottomSaveBtn) bottomSaveBtn.textContent = 'ذخیره تغییرات اطلاعیه (بدون خروج از صفحه)';
                            if (res.success) {
                                showToast('✓ ' + res.data.message);
                            } else {
                                showToast('خطا در ذخیره‌سازی تنظیمات');
                            }
                        });
                }

                if (form) form.addEventListener('submit', submitAjaxSave);
                if (topSaveBtn) topSaveBtn.addEventListener('click', submitAjaxSave);
            })();
            </script>
        </div>
        <?php
    }
}
`;

  const frontendPhp = `<?php
/**
 * Conditional Zero-Overhead Frontend Renderer & Shortcode Handler (v3.0)
 * Supports:
 *  - Post Types, Taxonomies, Term Slugs/IDs, WooCommerce Pages, URLs/IDs
 *  - Shortcode [popup_notice id="..."]
 *  - Session Mode (every_session, cookie_days, every_pageload)
 *  - Trigger Mode (immediate, delay_seconds, scroll_pixels, exit_intent)
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class PNP_Frontend {

    private array $matched_notices = array();

    public function __construct() {
        add_action( 'wp', array( $this, 'evaluate_matching_notices' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets_conditionally' ) );
        add_action( 'wp_footer', array( $this, 'render_matching_popups' ), 99 );
        add_shortcode( 'popup_notice', array( $this, 'render_shortcode_notice' ) );
    }

    public function evaluate_matching_notices(): void {
        if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
            return;
        }

        $all_notices = pnp_get_notices();
        if ( empty( $all_notices ) ) {
            return;
        }

        $matched = array();
        foreach ( $all_notices as $notice ) {
            if ( '1' !== (string) ( $notice['enabled'] ?? '0' ) ) {
                continue;
            }
            if ( $this->does_notice_match_current_request( $notice ) ) {
                $matched[] = $notice;
            }
        }

        usort( $matched, function( array $a, array $b ): int {
            return ( (int) ( $a['priority'] ?? 10 ) ) <=> ( (int) ( $b['priority'] ?? 10 ) );
        } );

        $this->matched_notices = $matched;
    }

    private function does_notice_match_current_request( array $n ): bool {
        $role_target = $n['target_user_roles'] ?? 'all';
        if ( 'guests_only' === $role_target && is_user_logged_in() ) {
            return false;
        }
        if ( 'logged_in_only' === $role_target && ! is_user_logged_in() ) {
            return false;
        }

        $current_id  = (int) get_queried_object_id();
        $request_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( (string) $_SERVER['REQUEST_URI'] ) ) : '/';

        // Check Exclusions first
        $exclude_raw = trim( (string) ( $n['exclude_pages'] ?? '' ) );
        if ( '' !== $exclude_raw && $this->matches_list_of_ids_or_urls( $exclude_raw, $current_id, $request_uri ) ) {
            return false;
        }

        $target = $n['display_target'] ?? 'all_pages';

        if ( 'shortcode_only' === $target ) {
            return false; // Only rendered when explicitly invoked via shortcode
        }

        if ( 'all_pages' === $target ) {
            return true;
        }

        if ( 'homepage_only' === $target ) {
            return is_front_page() || is_home();
        }

        if ( 'woo_all' === $target ) {
            return ( function_exists( 'is_woocommerce' ) && is_woocommerce() )
                || ( function_exists( 'is_cart' ) && is_cart() )
                || ( function_exists( 'is_checkout' ) && is_checkout() )
                || ( function_exists( 'is_account_page' ) && is_account_page() );
        }

        if ( 'woo_shop_product' === $target ) {
            return ( function_exists( 'is_shop' ) && is_shop() )
                || ( function_exists( 'is_product' ) && is_product() )
                || ( function_exists( 'is_product_category' ) && is_product_category() );
        }

        if ( 'woo_checkout_cart' === $target ) {
            return ( function_exists( 'is_checkout' ) && is_checkout() )
                || ( function_exists( 'is_cart' ) && is_cart() );
        }

        if ( 'advanced_rules' === $target ) {
            // 1. Check Post Types
            $current_pt = get_post_type( $current_id );
            if ( '1' === (string) ( $n['pt_post'] ?? '0' ) && is_singular( 'post' ) ) return true;
            if ( '1' === (string) ( $n['pt_page'] ?? '0' ) && is_page() ) return true;
            if ( '1' === (string) ( $n['pt_product'] ?? '0' ) && is_singular( 'product' ) ) return true;

            $custom_pts = trim( (string) ( $n['pt_custom'] ?? '' ) );
            if ( '' !== $custom_pts && $current_pt ) {
                $pt_list = array_map( 'trim', explode( ',', $custom_pts ) );
                if ( in_array( $current_pt, $pt_list, true ) ) {
                    return true;
                }
            }

            // 2. Check Taxonomies & Archives
            if ( '1' === (string) ( $n['tax_category'] ?? '0' ) && is_category() ) return true;
            if ( '1' === (string) ( $n['tax_post_tag'] ?? '0' ) && is_tag() ) return true;
            if ( '1' === (string) ( $n['tax_product_cat'] ?? '0' ) && function_exists( 'is_product_category' ) && is_product_category() ) return true;
            if ( '1' === (string) ( $n['tax_product_tag'] ?? '0' ) && function_exists( 'is_product_tag' ) && is_product_tag() ) return true;

            $specific_terms = trim( (string) ( $n['tax_terms'] ?? '' ) );
            if ( '' !== $specific_terms ) {
                $terms = array_map( 'trim', explode( ',', $specific_terms ) );
                if ( is_category( $terms ) || is_tag( $terms ) || is_tax( array( 'product_cat', 'product_tag' ), $terms ) ) {
                    return true;
                }
                if ( $current_id > 0 && ( has_term( $terms, 'category', $current_id ) || has_term( $terms, 'product_cat', $current_id ) ) ) {
                    return true;
                }
            }

            // 3. Check WooCommerce Endpoints
            if ( '1' === (string) ( $n['woo_shop'] ?? '0' ) && function_exists( 'is_shop' ) && is_shop() ) return true;
            if ( '1' === (string) ( $n['woo_cart'] ?? '0' ) && function_exists( 'is_cart' ) && is_cart() ) return true;
            if ( '1' === (string) ( $n['woo_checkout'] ?? '0' ) && function_exists( 'is_checkout' ) && is_checkout() ) return true;
            if ( '1' === (string) ( $n['woo_account'] ?? '0' ) && function_exists( 'is_account_page' ) && is_account_page() ) return true;

            // 4. Check Included URLs or Post IDs
            $include_raw = trim( (string) ( $n['include_pages'] ?? '' ) );
            if ( '' !== $include_raw && $this->matches_list_of_ids_or_urls( $include_raw, $current_id, $request_uri ) ) {
                return true;
            }

            return false;
        }

        return true;
    }

    private function matches_list_of_ids_or_urls( string $raw_list, int $current_id, string $request_uri ): bool {
        $lines = preg_split( '/[\\r\\n,]+/', $raw_list );
        if ( ! is_array( $lines ) ) {
            return false;
        }
        foreach ( $lines as $line ) {
            $item = trim( $line );
            if ( '' === $item ) {
                continue;
            }
            if ( is_numeric( $item ) && $current_id > 0 && (int) $item === $current_id ) {
                return true;
            }
            if ( false !== stripos( $request_uri, $item ) ) {
                return true;
            }
        }
        return false;
    }

    public function render_shortcode_notice( $atts ): string {
        $atts = shortcode_atts( array( 'id' => '' ), $atts, 'popup_notice' );
        $id   = sanitize_text_field( (string) $atts['id'] );
        if ( '' === $id ) {
            return '';
        }

        foreach ( pnp_get_notices() as $n ) {
            if ( ( $n['id'] ?? '' ) === $id ) {
                $this->matched_notices[] = $n;
                $this->enqueue_assets_conditionally();
                break;
            }
        }
        return '';
    }

    public function enqueue_assets_conditionally(): void {
        if ( empty( $this->matched_notices ) ) {
            return;
        }

        wp_enqueue_style(
            'pnp-popup-style',
            PNP_PLUGIN_URL . 'assets/css/pnp-popup.css',
            array(),
            PNP_VERSION
        );

        wp_enqueue_script(
            'pnp-popup-script',
            PNP_PLUGIN_URL . 'assets/js/pnp-popup.js',
            array(),
            PNP_VERSION,
            true
        );

        $js_notices = array();
        foreach ( $this->matched_notices as $n ) {
            $js_notices[] = array(
                'id'                   => $n['id'],
                'noticeVersion'        => $n['notice_version'] ?? '3.0.0',
                'requireCheckbox'      => '1' === (string) ( $n['require_checkbox'] ?? '1' ),
                'countdownSeconds'     => (int) ( $n['countdown_seconds'] ?? 0 ),
                'preventBackdropClose' => '1' === (string) ( $n['prevent_backdrop_close'] ?? '1' ),
                'preventEscClose'      => '1' === (string) ( $n['prevent_esc_close'] ?? '1' ),
                'triggerType'          => $n['trigger_type'] ?? 'immediate',
                'delaySeconds'         => (int) ( $n['delay_seconds'] ?? 3 ),
                'scrollPixels'         => (int) ( $n['scroll_pixels'] ?? 300 ),
                'sessionMode'          => $n['session_mode'] ?? 'every_session',
                'cookieExpireDays'     => (int) ( $n['cookie_expire_days'] ?? 30 ),
                'acceptBtnText'        => $n['accept_btn_text'] ?? 'تایید و ادامه',
            );
        }

        wp_localize_script(
            'pnp-popup-script',
            'pnpQueueConfig',
            array(
                'queueMode' => '${escapePhpSingleQuote(config.queueMode)}',
                'notices'   => $js_notices,
            )
        );
    }

    public function render_matching_popups(): void {
        if ( empty( $this->matched_notices ) ) {
            return;
        }

        foreach ( $this->matched_notices as $n ) {
            $id        = esc_attr( $n['id'] );
            $preset    = esc_attr( $n['style_preset'] ?? 'corporate-minimal' );
            $position  = esc_attr( $n['position'] ?? 'center' );
            $animation = esc_attr( $n['animation'] ?? 'zoom-bounce' );
            $primary   = $n['primary_color'] ?? '#2563eb';

            $inline_vars = sprintf(
                '--pnp-primary:%s;--pnp-btn-text:%s;--pnp-accent:%s;--pnp-bg:%s;--pnp-text:%s;--pnp-subtitle:%s;--pnp-body-bg:%s;--pnp-body-text:%s;--pnp-body-border:%s;--pnp-check-bg:%s;--pnp-check-text:%s;--pnp-width:%dpx;--pnp-radius:%dpx;--pnp-blur:%dpx;--pnp-overlay-opacity:%s;',
                esc_attr( $primary ),
                esc_attr( $n['button_text_color'] ?? '#ffffff' ),
                esc_attr( $n['accent_color'] ?? '#1d4ed8' ),
                esc_attr( $n['bg_color'] ?? '#ffffff' ),
                esc_attr( $n['text_color'] ?? '#0f172a' ),
                esc_attr( $n['subtitle_color'] ?? '#475569' ),
                esc_attr( $n['body_box_bg'] ?? '#f8fafc' ),
                esc_attr( $n['body_box_text'] ?? '#1e293b' ),
                esc_attr( $n['body_box_border'] ?? '#e2e8f0' ),
                esc_attr( $n['checkbox_box_bg'] ?? '#eff6ff' ),
                esc_attr( $n['checkbox_box_text'] ?? '#0f172a' ),
                (int) ( $n['width_px'] ?? 540 ),
                (int) ( $n['border_radius_px'] ?? 20 ),
                (int) ( $n['backdrop_blur_px'] ?? 12 ),
                number_format( ( (int) ( $n['overlay_opacity'] ?? 70 ) ) / 100, 2 )
            );

            $show_icon     = '1' === (string) ( $n['show_icon'] ?? '1' );
            $show_badge    = '1' === (string) ( $n['show_badge'] ?? '1' ) && ! empty( $n['badge_text'] );
            $show_title    = '1' === (string) ( $n['show_title'] ?? '1' ) && ! empty( $n['title'] );
            $show_subtitle = '1' === (string) ( $n['show_subtitle'] ?? '1' ) && ! empty( $n['subtitle'] );
            ?>
            <div id="pnp-overlay-<?php echo $id; ?>"
                 data-notice-id="<?php echo $id; ?>"
                 class="pnp-overlay pnp-preset-<?php echo $preset; ?> pnp-pos-<?php echo $position; ?> pnp-anim-<?php echo $animation; ?>"
                 style="<?php echo esc_attr( $inline_vars ); ?>"
                 dir="rtl"
                 role="dialog"
                 aria-modal="true"
                 hidden>

                <div class="pnp-modal-card" id="pnp-card-<?php echo $id; ?>">
                    <?php if ( '1' !== (string) ( $n['hide_close_btn'] ?? '1' ) ) : ?>
                        <button type="button" class="pnp-close-x" data-pnp-close="<?php echo $id; ?>" aria-label="بستن">&times;</button>
                    <?php endif; ?>

                    <?php if ( ! empty( $n['banner_image_url'] ) ) : ?>
                        <div class="pnp-banner-wrap">
                            <img src="<?php echo esc_url( $n['banner_image_url'] ); ?>" alt="<?php echo esc_attr( $n['title'] ?? '' ); ?>" class="pnp-banner-img" loading="lazy" />
                        </div>
                    <?php endif; ?>

                    <?php if ( $show_icon || $show_badge || $show_title || $show_subtitle ) : ?>
                        <div class="pnp-modal-header">
                            <?php if ( $show_icon ) : ?>
                                <div class="pnp-icon-box" aria-hidden="true">
                                    <?php echo pnp_get_icon_svg( $n['icon_type'] ?? 'shield', $primary ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                                </div>
                            <?php endif; ?>

                            <div class="pnp-header-texts">
                                <?php if ( $show_badge ) : ?>
                                    <div class="pnp-kicker-text"><?php echo esc_html( $n['badge_text'] ); ?></div>
                                <?php endif; ?>
                                <?php if ( $show_title ) : ?>
                                    <h2 class="pnp-title"><?php echo esc_html( $n['title'] ); ?></h2>
                                <?php endif; ?>
                                <?php if ( $show_subtitle ) : ?>
                                    <p class="pnp-subtitle"><?php echo esc_html( $n['subtitle'] ); ?></p>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endif; ?>

                    <div class="pnp-modal-body">
                        <?php echo wp_kses_post( $n['content_html'] ?? '' ); ?>
                    </div>

                    <div class="pnp-modal-footer">
                        <?php if ( '1' === (string) ( $n['require_checkbox'] ?? '1' ) ) : ?>
                            <label class="pnp-checkbox-row" for="pnp-check-<?php echo $id; ?>">
                                <input type="checkbox" id="pnp-check-<?php echo $id; ?>" class="pnp-checkbox-input" />
                                <span class="pnp-checkbox-text"><?php echo esc_html( $n['checkbox_label'] ?? '' ); ?></span>
                            </label>
                            <div id="pnp-error-<?php echo $id; ?>" class="pnp-error-msg" hidden><?php echo esc_html( $n['checkbox_error'] ?? '' ); ?></div>
                        <?php endif; ?>

                        <div class="pnp-actions-row">
                            <button type="button" id="pnp-accept-<?php echo $id; ?>" class="pnp-btn-primary">
                                <span id="pnp-accept-label-<?php echo $id; ?>"><?php echo esc_html( $n['accept_btn_text'] ?? 'تایید و ادامه' ); ?></span>
                            </button>

                            <?php if ( '1' === (string) ( $n['secondary_btn_enabled'] ?? '0' ) && ! empty( $n['secondary_btn_text'] ) ) : ?>
                                <a href="<?php echo esc_url( $n['secondary_btn_url'] ?? '#' ); ?>" target="_blank" rel="noopener noreferrer" class="pnp-btn-secondary">
                                    <?php echo esc_html( $n['secondary_btn_text'] ); ?>
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
            <?php
        }
    }
}
`;

  const popupCss = `/**
 * Smart Popup Notice Pro v3.0 - Contrast-Safe & Theme-Font Inherited Stylesheet
 * Zero external font files loaded - 100% inherits active WordPress theme typography
 */

.pnp-overlay,
.pnp-overlay *,
.pnp-modal-card,
.pnp-title,
.pnp-subtitle,
.pnp-modal-body,
.pnp-checkbox-text,
.pnp-btn-primary,
.pnp-btn-secondary {
  font-family: inherit !important;
  box-sizing: border-box;
}

.pnp-overlay {
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: rgba(8, 12, 22, var(--pnp-overlay-opacity, 0.7));
  backdrop-filter: blur(var(--pnp-blur, 12px));
  -webkit-backdrop-filter: blur(var(--pnp-blur, 12px));
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.3s ease;
}

.pnp-overlay.pnp-visible {
  opacity: 1;
  visibility: visible;
}

.pnp-overlay.pnp-pos-bottom-right {
  align-items: flex-end;
  justify-content: flex-start;
}

.pnp-overlay.pnp-pos-bottom-left {
  align-items: flex-end;
  justify-content: flex-end;
}

.pnp-overlay.pnp-pos-bottom-sheet {
  align-items: flex-end;
  padding: 0;
}

.pnp-modal-card {
  position: relative;
  width: 100%;
  max-width: var(--pnp-width, 540px);
  background-color: var(--pnp-bg, #ffffff);
  color: var(--pnp-text, #0f172a);
  border-radius: var(--pnp-radius, 20px);
  padding: 26px;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(148, 163, 184, 0.22);
  transform: scale(0.94) translateY(14px);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.pnp-overlay.pnp-visible .pnp-modal-card {
  transform: scale(1) translateY(0);
}

.pnp-preset-woo-checkout .pnp-modal-card {
  border-top: 5px solid var(--pnp-primary, #7c3aed);
}

.pnp-preset-luxury-dark .pnp-modal-card {
  border: 1px solid rgba(234, 179, 8, 0.45);
}

.pnp-preset-cyber-neon .pnp-modal-card {
  border: 1.5px solid var(--pnp-primary, #10b981);
}

.pnp-close-x {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(148, 163, 184, 0.12);
  color: var(--pnp-text, #0f172a);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pnp-banner-wrap {
  margin: -26px -26px 20px -26px;
  max-height: 185px;
  overflow: hidden;
}

.pnp-banner-img {
  width: 100%;
  height: 185px;
  object-fit: cover;
  display: block;
}

.pnp-modal-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;
}

.pnp-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: var(--pnp-check-bg, rgba(37, 99, 235, 0.1));
  border: 1px solid var(--pnp-body-border, rgba(37, 99, 235, 0.25));
}

.pnp-header-texts {
  flex: 1;
  min-width: 0;
}

.pnp-kicker-text {
  font-size: 12px;
  font-weight: 700;
  color: var(--pnp-accent, #2563eb);
  margin-bottom: 4px;
}

.pnp-title {
  margin: 0 0 6px 0 !important;
  font-size: 19px !important;
  font-weight: 800 !important;
  line-height: 1.45 !important;
  color: var(--pnp-text, #0f172a) !important;
}

.pnp-subtitle {
  margin: 0 !important;
  font-size: 13px !important;
  line-height: 1.6 !important;
  color: var(--pnp-subtitle, #475569) !important;
}

.pnp-modal-body {
  max-height: 230px;
  overflow-y: auto;
  padding: 16px 18px;
  border-radius: 14px;
  background-color: var(--pnp-body-bg, #f8fafc);
  color: var(--pnp-body-text, #1e293b);
  border: 1px solid var(--pnp-body-border, #e2e8f0);
  font-size: 14px;
  line-height: 1.85;
  margin-bottom: 18px;
}

.pnp-modal-body p {
  margin: 0 0 10px 0;
  color: inherit !important;
}

.pnp-modal-body p:last-child {
  margin-bottom: 0;
}

.pnp-modal-body ul {
  padding-right: 20px;
  margin: 8px 0;
  color: inherit !important;
}

.pnp-checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 15px;
  border-radius: 12px;
  background-color: var(--pnp-check-bg, #eff6ff);
  color: var(--pnp-check-text, #0f172a);
  border: 1px solid var(--pnp-body-border, #bfdbfe);
  cursor: pointer;
  user-select: none;
  margin-bottom: 14px;
  transition: border-color 0.2s ease;
}

.pnp-checkbox-row:hover {
  border-color: var(--pnp-primary, #2563eb);
}

.pnp-checkbox-input {
  width: 19px !important;
  height: 19px !important;
  margin: 3px 0 0 0 !important;
  accent-color: var(--pnp-primary, #2563eb);
  cursor: pointer;
  flex-shrink: 0;
}

.pnp-checkbox-text {
  font-size: 13.5px;
  font-weight: 700;
  line-height: 1.6;
  color: var(--pnp-check-text, #0f172a) !important;
}

.pnp-error-msg {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  margin-bottom: 12px;
}

.pnp-actions-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.pnp-btn-primary {
  flex: 1;
  background-color: var(--pnp-primary, #2563eb) !important;
  color: var(--pnp-btn-text, #ffffff) !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 13px 20px !important;
  font-size: 14px !important;
  font-weight: 800 !important;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.2s ease;
}

.pnp-btn-primary:hover {
  transform: translateY(-1px);
}

.pnp-btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.pnp-btn-secondary {
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--pnp-body-border, #cbd5e1);
  color: var(--pnp-text, #0f172a) !important;
  text-decoration: none !important;
  font-size: 13px;
  font-weight: 700;
}

@keyframes pnpShake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-7px); }
  40%, 80% { transform: translateX(7px); }
}

.pnp-shake {
  animation: pnpShake 0.45s ease both !important;
}
`;

  const popupJs = `/**
 * Smart Popup Notice Pro v3.0 - Session, Delay (N Seconds) & Scroll (N Pixels) Queue Controller
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof window.pnpQueueConfig === 'undefined' || !Array.isArray(window.pnpQueueConfig.notices)) {
      return;
    }

    var queueMode = window.pnpQueueConfig.queueMode || 'priority_sequential';
    var notices = window.pnpQueueConfig.notices;

    function getStorageKey(notice) {
      return 'pnp_ack_' + notice.id + '_v_' + notice.noticeVersion;
    }

    function hasAccepted(notice) {
      var mode = notice.sessionMode || 'every_session';
      if (mode === 'every_pageload') {
        return false;
      }
      var key = getStorageKey(notice);
      try {
        if (mode === 'every_session') {
          return sessionStorage.getItem(key) === 'true';
        }
        if (localStorage.getItem(key) === 'true') return true;
        if (document.cookie.indexOf(key + '=true') !== -1) return true;
      } catch (e) {}
      return false;
    }

    function saveAccepted(notice) {
      var mode = notice.sessionMode || 'every_session';
      if (mode === 'every_pageload') {
        return;
      }
      var key = getStorageKey(notice);
      try {
        if (mode === 'every_session') {
          sessionStorage.setItem(key, 'true');
        } else {
          localStorage.setItem(key, 'true');
          var d = new Date();
          d.setTime(d.getTime() + ((notice.cookieExpireDays || 30) * 86400000));
          document.cookie = key + '=true;expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
        }
      } catch (e) {}
    }

    var pendingQueue = notices.filter(function (n) {
      return !hasAccepted(n);
    });

    if (pendingQueue.length === 0) return;

    function activateNoticeInQueue(index) {
      if (index >= pendingQueue.length) return;
      var notice = pendingQueue[index];
      var overlay = document.getElementById('pnp-overlay-' + notice.id);
      var card = document.getElementById('pnp-card-' + notice.id);
      var checkbox = document.getElementById('pnp-check-' + notice.id);
      var acceptBtn = document.getElementById('pnp-accept-' + notice.id);
      var acceptLabel = document.getElementById('pnp-accept-label-' + notice.id);
      var errorMsg = document.getElementById('pnp-error-' + notice.id);
      var closeBtn = overlay ? overlay.querySelector('[data-pnp-close]') : null;

      if (!overlay || !acceptBtn) return;

      function triggerShake() {
        if (!card) return;
        card.classList.remove('pnp-shake');
        void card.offsetWidth;
        card.classList.add('pnp-shake');
      }

      var remainingSeconds = parseInt(notice.countdownSeconds, 10) || 0;
      var timerInterval = null;

      function showModal() {
        overlay.removeAttribute('hidden');
        requestAnimationFrame(function () {
          overlay.classList.add('pnp-visible');
        });

        if (remainingSeconds > 0 && acceptLabel) {
          acceptBtn.disabled = true;
          var baseText = notice.acceptBtnText;
          acceptLabel.textContent = baseText + ' (' + remainingSeconds + ' ثانیه)';
          timerInterval = setInterval(function () {
            remainingSeconds -= 1;
            if (remainingSeconds <= 0) {
              clearInterval(timerInterval);
              acceptBtn.disabled = false;
              acceptLabel.textContent = baseText;
            } else {
              acceptLabel.textContent = baseText + ' (' + remainingSeconds + ' ثانیه)';
            }
          }, 1000);
        }
      }

      function closeModalAndAdvance() {
        overlay.classList.remove('pnp-visible');
        setTimeout(function () {
          overlay.setAttribute('hidden', 'hidden');
          if (queueMode === 'priority_sequential' && index + 1 < pendingQueue.length) {
            activateNoticeInQueue(index + 1);
          }
        }, 320);
      }

      if (checkbox) {
        checkbox.addEventListener('change', function () {
          if (checkbox.checked && errorMsg) {
            errorMsg.setAttribute('hidden', 'hidden');
          }
        });
      }

      acceptBtn.addEventListener('click', function () {
        if (remainingSeconds > 0) return;
        if (notice.requireCheckbox && checkbox && !checkbox.checked) {
          if (errorMsg) errorMsg.removeAttribute('hidden');
          triggerShake();
          return;
        }
        saveAccepted(notice);
        closeModalAndAdvance();
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          if (notice.requireCheckbox && checkbox && !checkbox.checked) {
            if (errorMsg) errorMsg.removeAttribute('hidden');
            triggerShake();
            return;
          }
          closeModalAndAdvance();
        });
      }

      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          if (notice.preventBackdropClose) {
            triggerShake();
          } else {
            closeModalAndAdvance();
          }
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('pnp-visible')) {
          if (notice.preventEscClose) {
            e.preventDefault();
            triggerShake();
          } else {
            closeModalAndAdvance();
          }
        }
      });

      // Trigger execution: Immediate, Delay N Seconds, Scroll N Pixels, or Exit Intent
      if (index > 0) {
        showModal();
      } else if (notice.triggerType === 'delay_seconds') {
        var sec = Math.max(0, parseInt(notice.delaySeconds, 10) || 3);
        setTimeout(showModal, sec * 1000);
      } else if (notice.triggerType === 'scroll_pixels') {
        var targetPx = Math.max(10, parseInt(notice.scrollPixels, 10) || 300);
        var scrollTriggered = false;
        window.addEventListener('scroll', function () {
          if (scrollTriggered) return;
          var currentY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
          if (currentY >= targetPx) {
            scrollTriggered = true;
            showModal();
          }
        }, { passive: true });
      } else if (notice.triggerType === 'exit_intent') {
        var exitTriggered = false;
        document.addEventListener('mouseleave', function (e) {
          if (!exitTriggered && e.clientY <= 0) {
            exitTriggered = true;
            showModal();
          }
        });
      } else {
        showModal();
      }
    }

    activateNoticeInQueue(0);
  });
})();
`;

  const readmeTxt = `=== اطلاع رسانی پاپ آپ | Smart Popup Notice Pro (v3.0) ===
Contributors: miladriahi
Author: ${config.developerName}
Author URI: ${config.developerUrl}
Support Phone: ${config.developerPhone}
Requires at least: ${config.wpVersion}
Tested up to: ${config.wpVersion}
Requires PHP: ${config.phpVersion}
WC requires at least: ${config.wcVersion}
WC tested up to: ${config.wcVersion}
Stable tag: 3.0.0
License: GPLv2 or later

افزونه جامع و مدرن «اطلاع رسانی پاپ آپ» با داشبورد آماری ایجکس، شرط‌های پست‌تایپ و تکسونومی، نمایش در هر سشن یا بعد از N ثانیه و N پیکسل اسکرول.

== ویژگی‌های کلیدی نسخه 3.0 ==

* **منوی پیشخوان «اطلاع رسانی پاپ آپ» به همراه زیرمنوها**:
  1. پیشخوان و آمار (نمایش تعداد کل، فعال، غیرفعال و شورت‌کدها)
  2. همه اطلاعیه‌ها (مدیریت ایجکس بدون رفرش صفحه)
  3. افزودن / ویرایش اطلاعیه (ذخیره ایجکس بدون بازگشت ناخواسته به لیست + دکمه بازگشت مجزا)
* **تنظیمات دقیق نمایش برای هر اطلاعیه**:
  * نمایش در هر سشن (Session)، بر اساس روز انقضای کوکی، یا در هر بار لود صفحه
  * نمایش بعد از N ثانیه (مثلاً ۳ ثانیه)
  * نمایش بعد از N پیکسل اسکرول (مثلاً ۳۰۰ پیکسل)
* **فراخوانی هدفمند بر اساس پست‌تایپ، تکسونومی، آدرس و شورت‌کد**:
  * انتخاب پست‌تایپ‌ها (نوشته، برگه، محصول ووکامرس و پست‌تایپ‌های سفارشی)
  * انتخاب تکسونومی‌ها و دسته‌بندی‌ها
  * شورت‌کد اختصاصی \`[popup_notice id="..."]\` و تابع PHP \`popup_notice_render('id')\`
* **پروفایل‌های رنگی هوشمند به همراه پیشنهاد رنگ‌های مکمل**:
  * تغییر خودکار رنگ‌ها با خوانایی ۱۰۰٪ و ارائه پالت‌های پیشنهادی برای هر استایل.
`;

  return [
    {
      path: 'popup-notice-pro/popup-notice-pro.php',
      filename: 'popup-notice-pro.php',
      language: 'php',
      description: 'فایل اصلی نسخه ۳.۰ با عنوان «اطلاع رسانی پاپ آپ»، تابع شورت‌کد و آیکون‌های برداری SVG',
      content: mainPhp,
    },
    {
      path: 'popup-notice-pro/includes/class-pnp-admin.php',
      filename: 'includes/class-pnp-admin.php',
      language: 'php',
      description: 'پیشخوان مدرن و ایجکس (AJAX) با داشبورد آماری، زیرمنوها، ذخیره بدون خروج از صفحه و پیشنهادهای رنگی',
      content: adminPhp,
    },
    {
      path: 'popup-notice-pro/includes/class-pnp-frontend.php',
      filename: 'includes/class-pnp-frontend.php',
      language: 'php',
      description: 'موتور شرطی پست‌تایپ، تکسونومی، آدرس URL و شورت‌کد [popup_notice] بدون افت سرعت سایت',
      content: frontendPhp,
    },
    {
      path: 'popup-notice-pro/assets/css/pnp-popup.css',
      filename: 'assets/css/pnp-popup.css',
      language: 'css',
      description: 'استایل‌شیت با ارث‌بری فونت از قالب وردپرس و کنتراست کامل در تمام پروفایل‌های رنگی',
      content: popupCss,
    },
    {
      path: 'popup-notice-pro/assets/js/pnp-popup.js',
      filename: 'assets/js/pnp-popup.js',
      language: 'javascript',
      description: 'کنترلر نمایش در هر سشن (Session)، نمایش بعد از N ثانیه و نمایش بعد از N پیکسل اسکرول',
      content: popupJs,
    },
    {
      path: 'popup-notice-pro/readme.txt',
      filename: 'readme.txt',
      language: 'text',
      description: 'مستندات کامل نسخه ۳.۰ افزونه اطلاع رسانی پاپ آپ',
      content: readmeTxt,
    },
  ];
}

export async function downloadPluginZip(config: PluginConfig): Promise<void> {
  const zip = new JSZip();
  const files = generateWordPressPluginFiles(config);

  for (const file of files) {
    zip.file(file.path, file.content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'popup-notice-pro-v3.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
