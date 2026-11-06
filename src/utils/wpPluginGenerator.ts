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
            'delay_seconds'         => ${Number(n.delaySeconds) || 1},
            'scroll_percentage'     => ${Number(n.scrollPercentage) || 25},
            'storage_method'        => '${escapePhpSingleQuote(n.storageMethod)}',
            'cookie_expire_days'    => ${Number(n.cookieExpireDays) || 30},
        )`;
}

export function generateWordPressPluginFiles(config: PluginConfig): GeneratedPluginFile[] {
  const noticesPhpArray = config.notices.map(generatePhpNoticeArrayItem).join(',\n');

  const palettesJson = JSON.stringify(
    STYLE_PRESETS.reduce((acc, p) => {
      acc[p.id] = p.palette;
      return acc;
    }, {} as Record<string, any>)
  );

  const mainPhp = `<?php
/**
 * Plugin Name:       RokhNet Notice Pro | افزونه اطلاعیه و تعهدنامه هوشمند رخ‌نت (نسخه چندگانه)
 * Plugin URI:        ${config.developerUrl}
 * Description:       سیستم جامع و فوق‌سبک مدیریت چندگانه پاپ‌آپ اطلاعیه، قوانین و تعهدنامه با چک‌باکس تایید اجباری، ارث‌بری فونت از قالب، آیکون‌های برداری SVG، لود شرطی بدون افت سرعت و بدون بار دیتابیس.
 * Version:           2.0.0
 * Requires at least: ${config.wpVersion}
 * Tested up to:      ${config.wpVersion}
 * Requires PHP:      ${config.phpVersion}
 * WC requires at least: ${config.wcVersion}
 * WC tested up to:   ${config.wcVersion}
 * Author:            ${config.developerName} (${config.developerPhone})
 * Author URI:        ${config.developerUrl}
 * Text Domain:       rokhnet-notice-pro
 * Domain Path:       /languages
 * License:           GPL v2 or later
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'RNP_VERSION', '2.0.0' );
define( 'RNP_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'RNP_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'RNP_OPTION_KEY', 'rnp_notices_v2' );
define( 'RNP_DEVELOPER_NAME', '${escapePhpSingleQuote(config.developerName)}' );
define( 'RNP_DEVELOPER_PHONE', '${escapePhpSingleQuote(config.developerPhone)}' );
define( 'RNP_DEVELOPER_URL', '${escapePhpSingleQuote(config.developerUrl)}' );

/**
 * Declare full compatibility with WooCommerce 11.1+ HPOS & Cart/Checkout Blocks
 */
add_action( 'before_woocommerce_init', function() {
    if ( class_exists( \\Automattic\\WooCommerce\\Utilities\\FeaturesUtil::class ) ) {
        \\Automattic\\WooCommerce\\Utilities\\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
        \\Automattic\\WooCommerce\\Utilities\\FeaturesUtil::declare_compatibility( 'cart_checkout_blocks', __FILE__, true );
    }
} );

/**
 * Default pre-configured notices exported from RokhNet Notice Pro Studio v2.0
 */
function rnp_get_default_notices(): array {
    return array(
${noticesPhpArray}
    );
}

/**
 * Retrieve all configured notices (lightweight single-option storage, zero custom SQL tables)
 */
function rnp_get_notices(): array {
    $saved = get_option( RNP_OPTION_KEY, null );
    if ( ! is_array( $saved ) ) {
        return rnp_get_default_notices();
    }
    return array_values( $saved );
}

/**
 * Save notices array with autoload disabled to keep wp_options ultra-fast
 */
function rnp_save_notices( array $notices ): void {
    update_option( RNP_OPTION_KEY, array_values( $notices ), false );
}

/**
 * Inline SVG Icon Renderer (Guaranteed rendering on all WordPress themes without external icon fonts)
 */
function rnp_get_icon_svg( string $type, string $color = 'currentColor' ): string {
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

/**
 * Plugin Activation Hook: Seed default notices without creating any heavy database tables
 */
register_activation_hook( __FILE__, function() {
    if ( null === get_option( RNP_OPTION_KEY, null ) ) {
        rnp_save_notices( rnp_get_default_notices() );
    }
} );

require_once RNP_PLUGIN_DIR . 'includes/class-rnp-admin.php';
require_once RNP_PLUGIN_DIR . 'includes/class-rnp-frontend.php';

add_action( 'plugins_loaded', function() {
    if ( is_admin() ) {
        new RNP_Admin();
    }
    new RNP_Frontend();
} );
`;

  const adminPhp = `<?php
/**
 * Multi-Notice Admin Manager for RokhNet Notice Pro v2.0
 * Features: Create, Edit, Duplicate, Toggle, Delete Multiple Notices + Contrast-Safe Style Sync
 * Developer: ${config.developerName} (${config.developerPhone}) - ${config.developerUrl}
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class RNP_Admin {

    public function __construct() {
        add_action( 'admin_menu', array( $this, 'register_admin_menu' ) );
        add_action( 'admin_init', array( $this, 'handle_actions' ) );
        add_filter( 'plugin_action_links_' . plugin_basename( RNP_PLUGIN_DIR . 'rokhnet-notice-pro.php' ), array( $this, 'add_settings_link' ) );
    }

    public function add_settings_link( array $links ): array {
        $settings_link = '<a href="' . esc_url( admin_url( 'admin.php?page=rokhnet-notice-pro' ) ) . '" style="font-weight:bold;color:#2563eb;">مدیریت اطلاعیه‌ها</a>';
        array_unshift( $links, $settings_link );
        return $links;
    }

    public function register_admin_menu(): void {
        add_menu_page(
            'اطلاعیه‌های رخ‌نت',
            'اطلاعیه‌های رخ‌نت',
            'manage_options',
            'rokhnet-notice-pro',
            array( $this, 'render_admin_page' ),
            'dashicons-megaphone',
            58
        );
    }

    public function handle_actions(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        // Save or Update a Notice
        if ( isset( $_POST['rnp_save_notice_nonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['rnp_save_notice_nonce'] ) ), 'rnp_save_notice_action' ) ) {
            $notices = rnp_get_notices();
            $input   = isset( $_POST['rnp_notice'] ) && is_array( $_POST['rnp_notice'] ) ? $_POST['rnp_notice'] : array();
            $id      = ! empty( $input['id'] ) ? sanitize_text_field( wp_unslash( (string) $input['id'] ) ) : 'notice-' . time();

            $checkboxes = array(
                'enabled', 'show_icon', 'show_badge', 'show_title', 'show_subtitle',
                'require_checkbox', 'secondary_btn_enabled', 'inherit_theme_font',
                'prevent_backdrop_close', 'prevent_esc_close', 'hide_close_btn',
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
                'display_target', 'target_user_roles', 'trigger_type', 'storage_method'
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
                'overlay_opacity' => 70, 'countdown_seconds' => 0, 'delay_seconds' => 1,
                'scroll_percentage' => 25, 'cookie_expire_days' => 30
            );
            foreach ( $int_fields as $if => $def ) {
                $clean[ $if ] = isset( $input[ $if ] ) ? absint( $input[ $if ] ) : $def;
            }

            $found = false;
            foreach ( $notices as $idx => $existing ) {
                if ( isset( $existing['id'] ) && $existing['id'] === $id ) {
                    $notices[ $idx ] = $clean;
                    $found = true;
                    break;
                }
            }
            if ( ! $found ) {
                $notices[] = $clean;
            }

            rnp_save_notices( $notices );
            wp_safe_redirect( admin_url( 'admin.php?page=rokhnet-notice-pro&saved=1' ) );
            exit;
        }

        // Delete, Toggle, or Duplicate actions via GET
        if ( isset( $_GET['page'], $_GET['rnp_action'], $_GET['notice_id'], $_GET['_wpnonce'] ) && 'rokhnet-notice-pro' === $_GET['page'] ) {
            $action    = sanitize_text_field( wp_unslash( (string) $_GET['rnp_action'] ) );
            $notice_id = sanitize_text_field( wp_unslash( (string) $_GET['notice_id'] ) );
            if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( (string) $_GET['_wpnonce'] ) ), 'rnp_row_action_' . $notice_id ) ) {
                return;
            }

            $notices = rnp_get_notices();
            if ( 'delete' === $action ) {
                $notices = array_filter( $notices, function( $n ) use ( $notice_id ) {
                    return ( $n['id'] ?? '' ) !== $notice_id;
                } );
                rnp_save_notices( $notices );
            } elseif ( 'toggle' === $action ) {
                foreach ( $notices as &$n ) {
                    if ( ( $n['id'] ?? '' ) === $notice_id ) {
                        $n['enabled'] = ( '1' === (string) ( $n['enabled'] ?? '1' ) ) ? '0' : '1';
                        break;
                    }
                }
                rnp_save_notices( $notices );
            } elseif ( 'duplicate' === $action ) {
                foreach ( $notices as $n ) {
                    if ( ( $n['id'] ?? '' ) === $notice_id ) {
                        $copy = $n;
                        $copy['id'] = 'notice-' . time() . '-' . wp_rand( 10, 99 );
                        $copy['internal_name'] = ( $n['internal_name'] ?? 'اطلاعیه' ) . ' (کپی)';
                        $notices[] = $copy;
                        break;
                    }
                }
                rnp_save_notices( $notices );
            }

            wp_safe_redirect( admin_url( 'admin.php?page=rokhnet-notice-pro' ) );
            exit;
        }
    }

    public function render_admin_page(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        $notices     = rnp_get_notices();
        $edit_id     = isset( $_GET['edit_notice'] ) ? sanitize_text_field( wp_unslash( (string) $_GET['edit_notice'] ) ) : '';
        $is_creating = isset( $_GET['new_notice'] );

        ?>
        <div class="wrap" dir="rtl" style="max-width: 1180px; margin: 20px auto; font-family: inherit;">
            <!-- Header Banner -->
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #fff; padding: 24px 30px; border-radius: 16px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 24px; box-shadow: 0 12px 30px rgba(15,23,42,0.18);">
                <div>
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                        <span style="background:#2563eb;color:#fff;font-size:11px;font-weight:bold;padding:3px 10px;border-radius:6px;">نسخه ۲.۰ حرفه‌ای</span>
                        <span style="color:#94a3b8;font-size:12px;">بدون بار دیتابیس · لود شرطی هوشمند · ارث‌بری فونت قالب</span>
                    </div>
                    <h1 style="color: #fff; margin: 0 0 8px 0; font-size: 22px; font-weight: 800;">
                        مدیریت چندگانه اطلاعیه‌ها و تعهدنامه‌های هوشمند رخ‌نت (RokhNet Notice Pro)
                    </h1>
                    <p style="margin: 0; color: #cbd5e1; font-size: 13px;">
                        توسعه‌دهنده: <strong style="color: #38bdf8;"><?php echo esc_html( RNP_DEVELOPER_NAME ); ?></strong> ·
                        تماس: <a href="tel:<?php echo esc_attr( RNP_DEVELOPER_PHONE ); ?>" style="color: #38bdf8; text-decoration: none;"><?php echo esc_html( RNP_DEVELOPER_PHONE ); ?></a> ·
                        وبسایت: <a href="<?php echo esc_url( RNP_DEVELOPER_URL ); ?>" target="_blank" style="color: #38bdf8; text-decoration: none;"><?php echo esc_html( RNP_DEVELOPER_URL ); ?></a>
                    </p>
                </div>
                <div>
                    <?php if ( $edit_id || $is_creating ) : ?>
                        <a href="<?php echo esc_url( admin_url( 'admin.php?page=rokhnet-notice-pro' ) ); ?>" class="button button-secondary" style="padding: 6px 16px; height: auto; font-weight: bold;">
                            &rarr; بازگشت به لیست اطلاعیه‌ها
                        </a>
                    <?php else : ?>
                        <a href="<?php echo esc_url( admin_url( 'admin.php?page=rokhnet-notice-pro&new_notice=1' ) ); ?>" class="button button-primary" style="background: #2563eb; border-color: #2563eb; padding: 8px 20px; height: auto; font-size: 13px; font-weight: bold; border-radius: 10px;">
                            + افزودن اطلاعیه و پاپ‌آپ جدید
                        </a>
                    <?php endif; ?>
                </div>
            </div>

            <?php if ( isset( $_GET['saved'] ) ) : ?>
                <div class="notice notice-success is-dismissible" style="border-radius: 10px; padding: 12px 16px; margin-bottom: 20px;">
                    <strong>تنظیمات اطلاعیه با موفقیت ذخیره شد.</strong>
                </div>
            <?php endif; ?>

            <?php
            if ( $edit_id || $is_creating ) {
                $current = null;
                if ( $edit_id ) {
                    foreach ( $notices as $n ) {
                        if ( ( $n['id'] ?? '' ) === $edit_id ) {
                            $current = $n;
                            break;
                        }
                    }
                }
                if ( ! $current ) {
                    $defaults = rnp_get_default_notices();
                    $current  = $defaults[0];
                    $current['id']            = 'notice-' . time();
                    $current['internal_name'] = 'اطلاعیه جدید ' . ( count( $notices ) + 1 );
                    $current['priority']      = count( $notices ) + 1;
                }
                $this->render_notice_editor( $current );
            } else {
                $this->render_notices_table( $notices );
            }
            ?>
        </div>
        <?php
    }

    private function render_notices_table( array $notices ): void {
        ?>
        <div style="background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #e2e8f0;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
                <h2 style="margin:0;font-size:17px;color:#0f172a;">لیست پاپ‌آپ‌ها و اطلاعیه‌های تعریف شده (<?php echo count( $notices ); ?> مورد)</h2>
                <span style="font-size:12px;color:#64748b;">هر پاپ‌آپ فقط در صفحات انتخابی خودش لود می‌شود تا سرعت سایت ۱۰۰٪ حفظ گردد.</span>
            </div>

            <table class="widefat striped" style="border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
                <thead>
                    <tr style="background: #f8fafc;">
                        <th style="padding: 14px;">اولویت</th>
                        <th style="padding: 14px;">نام اطلاعیه و عنوان پاپ‌آپ</th>
                        <th style="padding: 14px;">وضعیت</th>
                        <th style="padding: 14px;">استایل ظاهری</th>
                        <th style="padding: 14px;">صفحات هدف (لود شرطی)</th>
                        <th style="padding: 14px;">نسخه</th>
                        <th style="padding: 14px;">عملیات مدیریت</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ( empty( $notices ) ) : ?>
                        <tr>
                            <td colspan="7" style="text-align:center;padding:30px;color:#64748b;">
                                هیچ اطلاعیه‌ای تعریف نشده است. روی دکمه «+ افزودن اطلاعیه و پاپ‌آپ جدید» کلیک کنید.
                            </td>
                        </tr>
                    <?php else : ?>
                        <?php foreach ( $notices as $n ) :
                            $id         = $n['id'] ?? '';
                            $is_enabled = '1' === (string) ( $n['enabled'] ?? '1' );
                            $nonce      = wp_create_nonce( 'rnp_row_action_' . $id );
                            $edit_url   = admin_url( 'admin.php?page=rokhnet-notice-pro&edit_notice=' . rawurlencode( $id ) );
                            $toggle_url = admin_url( 'admin.php?page=rokhnet-notice-pro&rnp_action=toggle&notice_id=' . rawurlencode( $id ) . '&_wpnonce=' . $nonce );
                            $dup_url    = admin_url( 'admin.php?page=rokhnet-notice-pro&rnp_action=duplicate&notice_id=' . rawurlencode( $id ) . '&_wpnonce=' . $nonce );
                            $del_url    = admin_url( 'admin.php?page=rokhnet-notice-pro&rnp_action=delete&notice_id=' . rawurlencode( $id ) . '&_wpnonce=' . $nonce );
                        ?>
                            <tr>
                                <td style="padding: 14px; font-weight: bold; color: #2563eb;">#<?php echo esc_html( (string) ( $n['priority'] ?? 1 ) ); ?></td>
                                <td style="padding: 14px;">
                                    <strong style="font-size: 14px; color: #0f172a; display: block; margin-bottom: 3px;">
                                        <a href="<?php echo esc_url( $edit_url ); ?>" style="text-decoration:none;color:inherit;"><?php echo esc_html( $n['internal_name'] ?? 'اطلاعیه' ); ?></a>
                                    </strong>
                                    <span style="font-size: 12px; color: #64748b;"><?php echo esc_html( $n['title'] ?? '' ); ?></span>
                                </td>
                                <td style="padding: 14px;">
                                    <a href="<?php echo esc_url( $toggle_url ); ?>" style="text-decoration:none;">
                                        <?php if ( $is_enabled ) : ?>
                                            <span style="color: #15803d; font-weight: bold; font-size: 12px;">● فعال در سایت</span>
                                        <?php else : ?>
                                            <span style="color: #94a3b8; font-weight: bold; font-size: 12px;">○ غیرفعال</span>
                                        <?php endif; ?>
                                    </a>
                                </td>
                                <td style="padding: 14px;">
                                    <span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;">
                                        <span style="width:12px;height:12px;border-radius:50%;background:<?php echo esc_attr( $n['primary_color'] ?? '#2563eb' ); ?>;display:inline-block;"></span>
                                        <?php echo esc_html( $n['style_preset'] ?? 'corporate-minimal' ); ?>
                                    </span>
                                </td>
                                <td style="padding: 14px; font-size: 12px; color: #334155;">
                                    <?php
                                    $target_labels = array(
                                        'all_pages'         => 'تمامی صفحات سایت',
                                        'homepage_only'     => 'فقط صفحه اصلی',
                                        'woo_all'           => 'کل صفحات ووکامرس',
                                        'woo_shop_product'  => 'فروشگاه و محصولات ووکامرس',
                                        'woo_checkout_cart' => 'سبد خرید و تسویه‌حساب ووکامرس',
                                        'custom_selection'  => 'صفحات و آدرس‌های انتخابی',
                                    );
                                    $t_key = $n['display_target'] ?? 'all_pages';
                                    echo esc_html( $target_labels[ $t_key ] ?? $t_key );
                                    ?>
                                </td>
                                <td style="padding: 14px; font-family: monospace; font-size: 12px;"><?php echo esc_html( $n['notice_version'] ?? '2.0.0' ); ?></td>
                                <td style="padding: 14px;">
                                    <div style="display:flex;gap:8px;align-items:center;">
                                        <a href="<?php echo esc_url( $edit_url ); ?>" class="button button-small button-primary">ویرایش کامل</a>
                                        <a href="<?php echo esc_url( $dup_url ); ?>" class="button button-small">کپی</a>
                                        <a href="<?php echo esc_url( $del_url ); ?>" class="button button-small" style="color:#dc2626;border-color:#fca5a5;" onclick="return confirm('آیا از حذف این اطلاعیه اطمینان دارید؟');">حذف</a>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    private function render_notice_editor( array $n ): void {
        ?>
        <form method="post" action="" style="background: #fff; padding: 28px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
            <?php wp_nonce_field( 'rnp_save_notice_action', 'rnp_save_notice_nonce' ); ?>
            <input type="hidden" name="rnp_notice[id]" value="<?php echo esc_attr( $n['id'] ); ?>" />

            <h2 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; color: #0f172a;">۱. مشخصات پایه، وضعیت و کنترل نمایش عناوین</h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row">وضعیت و اولویت نمایش</th>
                    <td>
                        <label style="margin-left: 24px;">
                            <input type="checkbox" name="rnp_notice[enabled]" value="1" <?php checked( '1', $n['enabled'] ?? '1' ); ?> />
                            <strong>فعال بودن این اطلاعیه</strong>
                        </label>
                        <label style="margin-left: 24px;">
                            اولویت نمایش (عدد کمتر = اولویت بالاتر):
                            <input type="number" name="rnp_notice[priority]" value="<?php echo esc_attr( (string) ( $n['priority'] ?? 1 ) ); ?>" min="1" max="99" style="width: 70px;" />
                        </label>
                        <label>
                            نسخه اطلاعیه (جهت ریست تایید کاربران):
                            <input type="text" name="rnp_notice[notice_version]" value="<?php echo esc_attr( $n['notice_version'] ?? '2.0.0' ); ?>" style="width: 100px;" />
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="row">نام داخلی اطلاعیه (جهت تشخیص در پنل)</th>
                    <td>
                        <input type="text" name="rnp_notice[internal_name]" value="<?php echo esc_attr( $n['internal_name'] ?? '' ); ?>" class="regular-text" required />
                    </td>
                </tr>
                <tr>
                    <th scope="row">آیکون بالای پاپ‌آپ (SVG برداری)</th>
                    <td>
                        <label style="margin-left: 16px;">
                            <input type="checkbox" name="rnp_notice[show_icon]" value="1" <?php checked( '1', $n['show_icon'] ?? '1' ); ?> />
                            نمایش آیکون در هدر پاپ‌آپ
                        </label>
                        <select name="rnp_notice[icon_type]">
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
                    <th scope="row">سوتیتر / بج بالای عنوان</th>
                    <td>
                        <label style="display:block;margin-bottom:6px;">
                            <input type="checkbox" name="rnp_notice[show_badge]" value="1" <?php checked( '1', $n['show_badge'] ?? '1' ); ?> />
                            فعال‌سازی نمایش سوتیتر بالای عنوان
                        </label>
                        <input type="text" name="rnp_notice[badge_text]" value="<?php echo esc_attr( $n['badge_text'] ?? '' ); ?>" class="regular-text" />
                    </td>
                </tr>
                <tr>
                    <th scope="row">عنوان اصلی پاپ‌آپ</th>
                    <td>
                        <label style="display:block;margin-bottom:6px;">
                            <input type="checkbox" name="rnp_notice[show_title]" value="1" <?php checked( '1', $n['show_title'] ?? '1' ); ?> />
                            فعال‌سازی نمایش عنوان اصلی
                        </label>
                        <input type="text" name="rnp_notice[title]" value="<?php echo esc_attr( $n['title'] ?? '' ); ?>" class="large-text" />
                    </td>
                </tr>
                <tr>
                    <th scope="row">زیرعنوان توضیحی</th>
                    <td>
                        <label style="display:block;margin-bottom:6px;">
                            <input type="checkbox" name="rnp_notice[show_subtitle]" value="1" <?php checked( '1', $n['show_subtitle'] ?? '1' ); ?> />
                            فعال‌سازی نمایش زیرعنوان
                        </label>
                        <input type="text" name="rnp_notice[subtitle]" value="<?php echo esc_attr( $n['subtitle'] ?? '' ); ?>" class="large-text" />
                    </td>
                </tr>
                <tr>
                    <th scope="row">متن کامل اطلاعیه</th>
                    <td>
                        <?php
                        wp_editor(
                            $n['content_html'] ?? '',
                            'rnp_content_html_editor',
                            array(
                                'textarea_name' => 'rnp_notice[content_html]',
                                'textarea_rows' => 7,
                                'media_buttons' => true,
                            )
                        );
                        ?>
                    </td>
                </tr>
                <tr>
                    <th scope="row">تیک اجباری و متن چک‌باکس</th>
                    <td>
                        <label style="display:block;margin-bottom:8px;">
                            <input type="checkbox" name="rnp_notice[require_checkbox]" value="1" <?php checked( '1', $n['require_checkbox'] ?? '1' ); ?> />
                            الزام کاربر به زدن تیک پیش از بستن پاپ‌آپ
                        </label>
                        <input type="text" name="rnp_notice[checkbox_label]" value="<?php echo esc_attr( $n['checkbox_label'] ?? '' ); ?>" class="large-text" placeholder="متن اطلاعیه را خواندم و متوجه شدم" />
                        <p class="description">پیام خطا در صورت عدم زدن تیک:</p>
                        <input type="text" name="rnp_notice[checkbox_error]" value="<?php echo esc_attr( $n['checkbox_error'] ?? '' ); ?>" class="large-text" />
                    </td>
                </tr>
                <tr>
                    <th scope="row">دکمه‌های پاپ‌آپ و بنر</th>
                    <td>
                        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:10px;">
                            <div>
                                <label>متن دکمه تایید اصلی:</label><br/>
                                <input type="text" name="rnp_notice[accept_btn_text]" value="<?php echo esc_attr( $n['accept_btn_text'] ?? '' ); ?>" class="regular-text" />
                            </div>
                            <div>
                                <label>
                                    <input type="checkbox" name="rnp_notice[secondary_btn_enabled]" value="1" <?php checked( '1', $n['secondary_btn_enabled'] ?? '0' ); ?> />
                                    نمایش دکمه فرعی (لینک بیشتر):
                                </label><br/>
                                <input type="text" name="rnp_notice[secondary_btn_text]" value="<?php echo esc_attr( $n['secondary_btn_text'] ?? '' ); ?>" placeholder="متن دکمه فرعی" />
                                <input type="url" name="rnp_notice[secondary_btn_url]" value="<?php echo esc_attr( $n['secondary_btn_url'] ?? '' ); ?>" placeholder="https://..." dir="ltr" />
                            </div>
                        </div>
                        <div>
                            <label>آدرس تصویر بنر بالای پاپ‌آپ (اختیاری):</label><br/>
                            <input type="url" name="rnp_notice[banner_image_url]" value="<?php echo esc_attr( $n['banner_image_url'] ?? '' ); ?>" class="large-text" dir="ltr" />
                        </div>
                    </td>
                </tr>
            </table>

            <h2 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-top: 28px; color: #0f172a;">۲. استایل مدرن، فونت قالب و رنگ‌بندی با خوانایی تضمین‌شده</h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row">انتخاب استایل (تنظیم خودکار رنگ‌های خوانا)</th>
                    <td>
                        <select name="rnp_notice[style_preset]" id="rnp-style-preset-select">
                            <option value="corporate-minimal" <?php selected( 'corporate-minimal', $n['style_preset'] ?? '' ); ?>>مینیمال روشن رسمی (Corporate Light - زمینه سفید بسیار خوانا)</option>
                            <option value="glassmorphism" <?php selected( 'glassmorphism', $n['style_preset'] ?? '' ); ?>>شیشه‌ای کریستالی تیره (Glassmorphism)</option>
                            <option value="luxury-dark" <?php selected( 'luxury-dark', $n['style_preset'] ?? '' ); ?>>دارک رویال طلایی (Luxury Gold)</option>
                            <option value="woo-checkout" <?php selected( 'woo-checkout', $n['style_preset'] ?? '' ); ?>>فروشگاهی ووکامرس روشن (WooCommerce Clean)</option>
                            <option value="cyber-neon" <?php selected( 'cyber-neon', $n['style_preset'] ?? '' ); ?>>هشدار زمردی تیره (Cyber Emerald)</option>
                            <option value="emerald-light" <?php selected( 'emerald-light', $n['style_preset'] ?? '' ); ?>>سبز مدرن روشن (Fresh Trust Light)</option>
                        </select>
                        <p class="description">با تغییر استایل، تمام رنگ‌های زیر به صورت هوشمند برای تضمین ۱۰۰٪ خوانایی متن‌ها بروزرسانی می‌شوند.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">فونت پاپ‌آپ</th>
                    <td>
                        <label>
                            <input type="checkbox" name="rnp_notice[inherit_theme_font]" value="1" <?php checked( '1', $n['inherit_theme_font'] ?? '1' ); ?> />
                            <strong>استفاده خودکار از فونت قالب وردپرس (بدون لود فونت اضافی و بدون کاهش سرعت سایت)</strong>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="row">پالت رنگ کامل (قابل سفارشی‌سازی)</th>
                    <td>
                        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px;">
                            <label>رنگ پس‌زمینه پاپ‌آپ:<br/><input type="color" id="rnp_bg_color" name="rnp_notice[bg_color]" value="<?php echo esc_attr( $n['bg_color'] ?? '#ffffff' ); ?>" /></label>
                            <label>رنگ عنوان و متن اصلی:<br/><input type="color" id="rnp_text_color" name="rnp_notice[text_color]" value="<?php echo esc_attr( $n['text_color'] ?? '#0f172a' ); ?>" /></label>
                            <label>رنگ زیرعنوان:<br/><input type="color" id="rnp_subtitle_color" name="rnp_notice[subtitle_color]" value="<?php echo esc_attr( $n['subtitle_color'] ?? '#475569' ); ?>" /></label>
                            <label>رنگ پس‌زمینه کادر متن:<br/><input type="color" id="rnp_body_box_bg" name="rnp_notice[body_box_bg]" value="<?php echo esc_attr( $n['body_box_bg'] ?? '#f8fafc' ); ?>" /></label>
                            <label>رنگ متن داخل کادر:<br/><input type="color" id="rnp_body_box_text" name="rnp_notice[body_box_text]" value="<?php echo esc_attr( $n['body_box_text'] ?? '#1e293b' ); ?>" /></label>
                            <label>رنگ حاشیه کادر متن:<br/><input type="color" id="rnp_body_box_border" name="rnp_notice[body_box_border]" value="<?php echo esc_attr( $n['body_box_border'] ?? '#e2e8f0' ); ?>" /></label>
                            <label>رنگ پس‌زمینه چک‌باکس:<br/><input type="color" id="rnp_checkbox_box_bg" name="rnp_notice[checkbox_box_bg]" value="<?php echo esc_attr( $n['checkbox_box_bg'] ?? '#eff6ff' ); ?>" /></label>
                            <label>رنگ متن چک‌باکس:<br/><input type="color" id="rnp_checkbox_box_text" name="rnp_notice[checkbox_box_text]" value="<?php echo esc_attr( $n['checkbox_box_text'] ?? '#0f172a' ); ?>" /></label>
                            <label>رنگ دکمه اصلی و آیکون:<br/><input type="color" id="rnp_primary_color" name="rnp_notice[primary_color]" value="<?php echo esc_attr( $n['primary_color'] ?? '#2563eb' ); ?>" /></label>
                            <label>رنگ متن دکمه اصلی:<br/><input type="color" id="rnp_button_text_color" name="rnp_notice[button_text_color]" value="<?php echo esc_attr( $n['button_text_color'] ?? '#ffffff' ); ?>" /></label>
                            <label>رنگ سوتیتر (Accent):<br/><input type="color" id="rnp_accent_color" name="rnp_notice[accent_color]" value="<?php echo esc_attr( $n['accent_color'] ?? '#1d4ed8' ); ?>" /></label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">ابعاد و موقعیت قرارگیری</th>
                    <td>
                        موقعیت:
                        <select name="rnp_notice[position]">
                            <option value="center" <?php selected( 'center', $n['position'] ?? 'center' ); ?>>وسط صفحه (Modal Center)</option>
                            <option value="bottom-right" <?php selected( 'bottom-right', $n['position'] ?? '' ); ?>>شناور پایین راست</option>
                            <option value="bottom-left" <?php selected( 'bottom-left', $n['position'] ?? '' ); ?>>شناور پایین چپ</option>
                            <option value="bottom-sheet" <?php selected( 'bottom-sheet', $n['position'] ?? '' ); ?>>کشویی پایین صفحه (Bottom Sheet)</option>
                        </select>
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                        حداکثر عرض: <input type="number" name="rnp_notice[width_px]" value="<?php echo esc_attr( (string) ( $n['width_px'] ?? 540 ) ); ?>" style="width:80px;" />px
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                        گردی گوشه‌ها: <input type="number" name="rnp_notice[border_radius_px]" value="<?php echo esc_attr( (string) ( $n['border_radius_px'] ?? 20 ) ); ?>" style="width:70px;" />px
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                        بلور پس‌زمینه: <input type="number" name="rnp_notice[backdrop_blur_px]" value="<?php echo esc_attr( (string) ( $n['backdrop_blur_px'] ?? 12 ) ); ?>" style="width:70px;" />px
                    </td>
                </tr>
            </table>

            <h2 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-top: 28px; color: #0f172a;">۳. انتخاب صفحات هدف (لود شرطی بدون افت سرعت سایت) و ماندگاری کوکی</h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row">محل نمایش این پاپ‌آپ</th>
                    <td>
                        <select name="rnp_notice[display_target]">
                            <option value="all_pages" <?php selected( 'all_pages', $n['display_target'] ?? '' ); ?>>تمامی صفحات سایت</option>
                            <option value="homepage_only" <?php selected( 'homepage_only', $n['display_target'] ?? '' ); ?>>فقط صفحه اصلی (Homepage)</option>
                            <option value="woo_all" <?php selected( 'woo_all', $n['display_target'] ?? '' ); ?>>تمامی صفحات فروشگاه ووکامرس</option>
                            <option value="woo_shop_product" <?php selected( 'woo_shop_product', $n['display_target'] ?? '' ); ?>>فقط صفحات فروشگاه، دسته‌ها و محصولات ووکامرس</option>
                            <option value="woo_checkout_cart" <?php selected( 'woo_checkout_cart', $n['display_target'] ?? '' ); ?>>فقط سبد خرید و تسویه‌حساب ووکامرس</option>
                            <option value="custom_selection" <?php selected( 'custom_selection', $n['display_target'] ?? '' ); ?>>انتخاب ترکیبی سفارشی (برگه‌های ووکامرس + آیدی یا آدرس خاص)</option>
                        </select>
                        <div style="margin-top:12px;padding:12px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">
                            <strong>در حالت «انتخاب ترکیبی سفارشی»، برگه‌های مورد نظر ووکامرس را تیک بزنید:</strong><br/>
                            <label style="margin-left:14px;"><input type="checkbox" name="rnp_notice[woo_shop]" value="1" <?php checked( '1', $n['woo_shop'] ?? '0' ); ?> /> صفحه فروشگاه (Shop)</label>
                            <label style="margin-left:14px;"><input type="checkbox" name="rnp_notice[woo_product]" value="1" <?php checked( '1', $n['woo_product'] ?? '0' ); ?> /> صفحات تکی محصول</label>
                            <label style="margin-left:14px;"><input type="checkbox" name="rnp_notice[woo_category]" value="1" <?php checked( '1', $n['woo_category'] ?? '0' ); ?> /> دسته‌بندی محصولات</label>
                            <label style="margin-left:14px;"><input type="checkbox" name="rnp_notice[woo_cart]" value="1" <?php checked( '1', $n['woo_cart'] ?? '0' ); ?> /> سبد خرید (Cart)</label>
                            <label style="margin-left:14px;"><input type="checkbox" name="rnp_notice[woo_checkout]" value="1" <?php checked( '1', $n['woo_checkout'] ?? '0' ); ?> /> تسویه‌حساب (Checkout)</label>
                            <label><input type="checkbox" name="rnp_notice[woo_account]" value="1" <?php checked( '1', $n['woo_account'] ?? '0' ); ?> /> حساب کاربری من</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">آدرس‌ها یا آیدی برگه‌های شامل (Include)</th>
                    <td>
                        <textarea name="rnp_notice[include_pages]" rows="3" class="large-text" dir="ltr" placeholder="/checkout&#10;/about-us&#10;145"><?php echo esc_textarea( $n['include_pages'] ?? '' ); ?></textarea>
                        <p class="description">هر آدرس نسبی (مثلاً <code>/sample-page</code>) یا شناسه عددی برگه/محصول (مثلاً <code>145</code>) را در یک خط وارد کنید.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">آدرس‌ها یا آیدی برگه‌های مستثنی (Exclude)</th>
                    <td>
                        <textarea name="rnp_notice[exclude_pages]" rows="2" class="large-text" dir="ltr" placeholder="/contact-us&#10;210"><?php echo esc_textarea( $n['exclude_pages'] ?? '' ); ?></textarea>
                        <p class="description">در این صفحات پاپ‌آپ به هیچ عنوان لود نخواهد شد.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">رفتار قفل، زمان‌بندی و کوکی</th>
                    <td>
                        <label style="margin-left:16px;"><input type="checkbox" name="rnp_notice[prevent_backdrop_close]" value="1" <?php checked( '1', $n['prevent_backdrop_close'] ?? '1' ); ?> /> جلوگیری از بسته شدن با کلیک بیرون کادر</label>
                        <label style="margin-left:16px;"><input type="checkbox" name="rnp_notice[prevent_esc_close]" value="1" <?php checked( '1', $n['prevent_esc_close'] ?? '1' ); ?> /> قفل دکمه ESC کیبورد</label>
                        <label><input type="checkbox" name="rnp_notice[hide_close_btn]" value="1" <?php checked( '1', $n['hide_close_btn'] ?? '1' ); ?> /> مخفی کردن دکمه ضربدر (X)</label>
                        <br/><br/>
                        تایمر مطالعه اجباری: <input type="number" name="rnp_notice[countdown_seconds]" value="<?php echo esc_attr( (string) ( $n['countdown_seconds'] ?? 0 ) ); ?>" style="width:70px;" min="0" max="120" /> ثانیه
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                        مدت ماندگاری کوکی در مرورگر کاربر: <input type="number" name="rnp_notice[cookie_expire_days]" value="<?php echo esc_attr( (string) ( $n['cookie_expire_days'] ?? 30 ) ); ?>" style="width:70px;" min="1" max="365" /> روز
                    </td>
                </tr>
            </table>

            <script>
            (function(){
                var palettes = <?php echo $palettesJson; ?>;
                var select = document.getElementById('rnp-style-preset-select');
                if (!select) return;
                select.addEventListener('change', function() {
                    var p = palettes[select.value];
                    if (!p) return;
                    var map = {
                        'rnp_bg_color': p.backgroundColor,
                        'rnp_text_color': p.textColor,
                        'rnp_subtitle_color': p.subtitleColor,
                        'rnp_body_box_bg': p.bodyBoxBg,
                        'rnp_body_box_text': p.bodyBoxText,
                        'rnp_body_box_border': p.bodyBoxBorder,
                        'rnp_checkbox_box_bg': p.checkboxBoxBg,
                        'rnp_checkbox_box_text': p.checkboxBoxText,
                        'rnp_primary_color': p.primaryColor,
                        'rnp_button_text_color': p.buttonTextColor,
                        'rnp_accent_color': p.accentColor
                    };
                    Object.keys(map).forEach(function(id) {
                        var el = document.getElementById(id);
                        if (el && map[id]) el.value = map[id];
                    });
                });
            })();
            </script>

            <?php submit_button( 'ذخیره تنظیمات این اطلاعیه' ); ?>
        </form>
        <?php
    }
}
`;

  const frontendPhp = `<?php
/**
 * Conditional Zero-Overhead Frontend Renderer for RokhNet Notice Pro v2.0
 * Features:
 *  - Evaluates page conditions BEFORE enqueueing assets (0 KB overhead on non-target pages)
 *  - Renders inline SVG icons directly in HTML
 *  - Inherits active WordPress theme fonts (zero external font requests)
 *  - Pure browser Cookie & LocalStorage persistence (zero database bloat)
 * Developer: ${config.developerName} (${config.developerPhone}) - ${config.developerUrl}
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class RNP_Frontend {

    private array $matched_notices = array();

    public function __construct() {
        add_action( 'wp', array( $this, 'evaluate_matching_notices' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets_conditionally' ) );
        add_action( 'wp_footer', array( $this, 'render_matching_popups' ), 99 );
    }

    /**
     * Evaluate active notices against current page request and sort by priority
     */
    public function evaluate_matching_notices(): void {
        if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
            return;
        }

        $all_notices = rnp_get_notices();
        if ( empty( $all_notices ) ) {
            return;
        }

        $matched = array();
        foreach ( $all_notices as $notice ) {
            if ( '1' !== (string) ( $notice['enabled'] ?? '0' ) ) {
                continue;
            }
            if ( $this->does_notice_match_current_page( $notice ) ) {
                $matched[] = $notice;
            }
        }

        usort( $matched, function( array $a, array $b ): int {
            return ( (int) ( $a['priority'] ?? 10 ) ) <=> ( (int) ( $b['priority'] ?? 10 ) );
        } );

        $this->matched_notices = $matched;
    }

    private function does_notice_match_current_page( array $n ): bool {
        // 1. User Role Check
        $role_target = $n['target_user_roles'] ?? 'all';
        if ( 'guests_only' === $role_target && is_user_logged_in() ) {
            return false;
        }
        if ( 'logged_in_only' === $role_target && ! is_user_logged_in() ) {
            return false;
        }

        $current_id  = (int) get_queried_object_id();
        $request_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( (string) $_SERVER['REQUEST_URI'] ) ) : '/';

        // 2. Check Excluded Pages / URLs first
        $exclude_raw = trim( (string) ( $n['exclude_pages'] ?? '' ) );
        if ( '' !== $exclude_raw && $this->matches_list_of_ids_or_urls( $exclude_raw, $current_id, $request_uri ) ) {
            return false;
        }

        // 3. Check Display Target Mode
        $target = $n['display_target'] ?? 'all_pages';

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

        if ( 'custom_selection' === $target ) {
            if ( '1' === (string) ( $n['woo_shop'] ?? '0' ) && function_exists( 'is_shop' ) && is_shop() ) return true;
            if ( '1' === (string) ( $n['woo_product'] ?? '0' ) && function_exists( 'is_product' ) && is_product() ) return true;
            if ( '1' === (string) ( $n['woo_category'] ?? '0' ) && function_exists( 'is_product_category' ) && is_product_category() ) return true;
            if ( '1' === (string) ( $n['woo_cart'] ?? '0' ) && function_exists( 'is_cart' ) && is_cart() ) return true;
            if ( '1' === (string) ( $n['woo_checkout'] ?? '0' ) && function_exists( 'is_checkout' ) && is_checkout() ) return true;
            if ( '1' === (string) ( $n['woo_account'] ?? '0' ) && function_exists( 'is_account_page' ) && is_account_page() ) return true;

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

    /**
     * Only enqueue CSS and JS if at least one active notice matches the current page
     */
    public function enqueue_assets_conditionally(): void {
        if ( empty( $this->matched_notices ) ) {
            return;
        }

        wp_enqueue_style(
            'rnp-popup-style',
            RNP_PLUGIN_URL . 'assets/css/rnp-popup.css',
            array(),
            RNP_VERSION
        );

        wp_enqueue_script(
            'rnp-popup-script',
            RNP_PLUGIN_URL . 'assets/js/rnp-popup.js',
            array(),
            RNP_VERSION,
            true
        );

        $js_notices = array();
        foreach ( $this->matched_notices as $n ) {
            $js_notices[] = array(
                'id'                   => $n['id'],
                'noticeVersion'        => $n['notice_version'] ?? '2.0.0',
                'requireCheckbox'      => '1' === (string) ( $n['require_checkbox'] ?? '1' ),
                'countdownSeconds'     => (int) ( $n['countdown_seconds'] ?? 0 ),
                'preventBackdropClose' => '1' === (string) ( $n['prevent_backdrop_close'] ?? '1' ),
                'preventEscClose'      => '1' === (string) ( $n['prevent_esc_close'] ?? '1' ),
                'triggerType'          => $n['trigger_type'] ?? 'immediate',
                'delaySeconds'         => (int) ( $n['delay_seconds'] ?? 1 ),
                'scrollPercentage'     => (int) ( $n['scroll_percentage'] ?? 25 ),
                'storageMethod'        => $n['storage_method'] ?? 'cookie_localstorage',
                'cookieExpireDays'     => (int) ( $n['cookie_expire_days'] ?? 30 ),
                'acceptBtnText'        => $n['accept_btn_text'] ?? 'تایید و ادامه',
            );
        }

        wp_localize_script(
            'rnp-popup-script',
            'rnpQueueConfig',
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
                '--rnp-primary:%s;--rnp-btn-text:%s;--rnp-accent:%s;--rnp-bg:%s;--rnp-text:%s;--rnp-subtitle:%s;--rnp-body-bg:%s;--rnp-body-text:%s;--rnp-body-border:%s;--rnp-check-bg:%s;--rnp-check-text:%s;--rnp-width:%dpx;--rnp-radius:%dpx;--rnp-blur:%dpx;--rnp-overlay-opacity:%s;',
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
            <div id="rnp-overlay-<?php echo $id; ?>"
                 data-notice-id="<?php echo $id; ?>"
                 class="rnp-overlay rnp-preset-<?php echo $preset; ?> rnp-pos-<?php echo $position; ?> rnp-anim-<?php echo $animation; ?>"
                 style="<?php echo esc_attr( $inline_vars ); ?>"
                 dir="rtl"
                 role="dialog"
                 aria-modal="true"
                 hidden>

                <div class="rnp-modal-card" id="rnp-card-<?php echo $id; ?>">
                    <?php if ( '1' !== (string) ( $n['hide_close_btn'] ?? '1' ) ) : ?>
                        <button type="button" class="rnp-close-x" data-rnp-close="<?php echo $id; ?>" aria-label="بستن">&times;</button>
                    <?php endif; ?>

                    <?php if ( ! empty( $n['banner_image_url'] ) ) : ?>
                        <div class="rnp-banner-wrap">
                            <img src="<?php echo esc_url( $n['banner_image_url'] ); ?>" alt="<?php echo esc_attr( $n['title'] ?? '' ); ?>" class="rnp-banner-img" loading="lazy" />
                        </div>
                    <?php endif; ?>

                    <?php if ( $show_icon || $show_badge || $show_title || $show_subtitle ) : ?>
                        <div class="rnp-modal-header">
                            <?php if ( $show_icon ) : ?>
                                <div class="rnp-icon-box" aria-hidden="true">
                                    <?php echo rnp_get_icon_svg( $n['icon_type'] ?? 'shield', $primary ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                                </div>
                            <?php endif; ?>

                            <div class="rnp-header-texts">
                                <?php if ( $show_badge ) : ?>
                                    <div class="rnp-kicker-text"><?php echo esc_html( $n['badge_text'] ); ?></div>
                                <?php endif; ?>
                                <?php if ( $show_title ) : ?>
                                    <h2 class="rnp-title"><?php echo esc_html( $n['title'] ); ?></h2>
                                <?php endif; ?>
                                <?php if ( $show_subtitle ) : ?>
                                    <p class="rnp-subtitle"><?php echo esc_html( $n['subtitle'] ); ?></p>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endif; ?>

                    <div class="rnp-modal-body">
                        <?php echo wp_kses_post( $n['content_html'] ?? '' ); ?>
                    </div>

                    <div class="rnp-modal-footer">
                        <?php if ( '1' === (string) ( $n['require_checkbox'] ?? '1' ) ) : ?>
                            <label class="rnp-checkbox-row" for="rnp-check-<?php echo $id; ?>">
                                <input type="checkbox" id="rnp-check-<?php echo $id; ?>" class="rnp-checkbox-input" />
                                <span class="rnp-checkbox-text"><?php echo esc_html( $n['checkbox_label'] ?? '' ); ?></span>
                            </label>
                            <div id="rnp-error-<?php echo $id; ?>" class="rnp-error-msg" hidden><?php echo esc_html( $n['checkbox_error'] ?? '' ); ?></div>
                        <?php endif; ?>

                        <div class="rnp-actions-row">
                            <button type="button" id="rnp-accept-<?php echo $id; ?>" class="rnp-btn-primary">
                                <span id="rnp-accept-label-<?php echo $id; ?>"><?php echo esc_html( $n['accept_btn_text'] ?? 'تایید و ادامه' ); ?></span>
                            </button>

                            <?php if ( '1' === (string) ( $n['secondary_btn_enabled'] ?? '0' ) && ! empty( $n['secondary_btn_text'] ) ) : ?>
                                <a href="<?php echo esc_url( $n['secondary_btn_url'] ?? '#' ); ?>" target="_blank" rel="noopener noreferrer" class="rnp-btn-secondary">
                                    <?php echo esc_html( $n['secondary_btn_text'] ); ?>
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
            <?php
            if ( ! empty( $n['custom_css'] ) ) {
                echo '<style>' . wp_strip_all_tags( $n['custom_css'] ) . '</style>';
            }
        }
    }
}
`;

  const popupCss = `/**
 * RokhNet Notice Pro v2.0 - Contrast-Safe & Theme-Font Inherited Stylesheet
 * Developer: ${config.developerName} (${config.developerPhone}) - ${config.developerUrl}
 * Zero external font files loaded - 100% inherits active WordPress theme typography
 */

.rnp-overlay,
.rnp-overlay *,
.rnp-modal-card,
.rnp-title,
.rnp-subtitle,
.rnp-modal-body,
.rnp-checkbox-text,
.rnp-btn-primary,
.rnp-btn-secondary {
  font-family: inherit !important;
  box-sizing: border-box;
}

.rnp-overlay {
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: rgba(8, 12, 22, var(--rnp-overlay-opacity, 0.7));
  backdrop-filter: blur(var(--rnp-blur, 12px));
  -webkit-backdrop-filter: blur(var(--rnp-blur, 12px));
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.3s ease;
}

.rnp-overlay.rnp-visible {
  opacity: 1;
  visibility: visible;
}

.rnp-overlay.rnp-pos-bottom-right {
  align-items: flex-end;
  justify-content: flex-start;
}

.rnp-overlay.rnp-pos-bottom-left {
  align-items: flex-end;
  justify-content: flex-end;
}

.rnp-overlay.rnp-pos-bottom-sheet {
  align-items: flex-end;
  padding: 0;
}

.rnp-modal-card {
  position: relative;
  width: 100%;
  max-width: var(--rnp-width, 540px);
  background-color: var(--rnp-bg, #ffffff);
  color: var(--rnp-text, #0f172a);
  border-radius: var(--rnp-radius, 20px);
  padding: 26px;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(148, 163, 184, 0.22);
  transform: scale(0.94) translateY(14px);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.rnp-overlay.rnp-visible .rnp-modal-card {
  transform: scale(1) translateY(0);
}

.rnp-preset-woo-checkout .rnp-modal-card {
  border-top: 5px solid var(--rnp-primary, #7c3aed);
}

.rnp-preset-luxury-dark .rnp-modal-card {
  border: 1px solid rgba(234, 179, 8, 0.45);
}

.rnp-preset-cyber-neon .rnp-modal-card {
  border: 1.5px solid var(--rnp-primary, #10b981);
}

.rnp-close-x {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(148, 163, 184, 0.12);
  color: var(--rnp-text, #0f172a);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rnp-banner-wrap {
  margin: -26px -26px 20px -26px;
  max-height: 185px;
  overflow: hidden;
}

.rnp-banner-img {
  width: 100%;
  height: 185px;
  object-fit: cover;
  display: block;
}

.rnp-modal-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;
}

.rnp-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: var(--rnp-check-bg, rgba(37, 99, 235, 0.1));
  border: 1px solid var(--rnp-body-border, rgba(37, 99, 235, 0.25));
}

.rnp-header-texts {
  flex: 1;
  min-width: 0;
}

.rnp-kicker-text {
  font-size: 12px;
  font-weight: 700;
  color: var(--rnp-accent, #2563eb);
  margin-bottom: 4px;
}

.rnp-title {
  margin: 0 0 6px 0 !important;
  font-size: 19px !important;
  font-weight: 800 !important;
  line-height: 1.45 !important;
  color: var(--rnp-text, #0f172a) !important;
}

.rnp-subtitle {
  margin: 0 !important;
  font-size: 13px !important;
  line-height: 1.6 !important;
  color: var(--rnp-subtitle, #475569) !important;
}

.rnp-modal-body {
  max-height: 230px;
  overflow-y: auto;
  padding: 16px 18px;
  border-radius: 14px;
  background-color: var(--rnp-body-bg, #f8fafc);
  color: var(--rnp-body-text, #1e293b);
  border: 1px solid var(--rnp-body-border, #e2e8f0);
  font-size: 14px;
  line-height: 1.85;
  margin-bottom: 18px;
}

.rnp-modal-body p {
  margin: 0 0 10px 0;
  color: inherit !important;
}

.rnp-modal-body p:last-child {
  margin-bottom: 0;
}

.rnp-modal-body ul {
  padding-right: 20px;
  margin: 8px 0;
  color: inherit !important;
}

.rnp-checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 15px;
  border-radius: 12px;
  background-color: var(--rnp-check-bg, #eff6ff);
  color: var(--rnp-check-text, #0f172a);
  border: 1px solid var(--rnp-body-border, #bfdbfe);
  cursor: pointer;
  user-select: none;
  margin-bottom: 14px;
  transition: border-color 0.2s ease;
}

.rnp-checkbox-row:hover {
  border-color: var(--rnp-primary, #2563eb);
}

.rnp-checkbox-input {
  width: 19px !important;
  height: 19px !important;
  margin: 3px 0 0 0 !important;
  accent-color: var(--rnp-primary, #2563eb);
  cursor: pointer;
  flex-shrink: 0;
}

.rnp-checkbox-text {
  font-size: 13.5px;
  font-weight: 700;
  line-height: 1.6;
  color: var(--rnp-check-text, #0f172a) !important;
}

.rnp-error-msg {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  margin-bottom: 12px;
}

.rnp-actions-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.rnp-btn-primary {
  flex: 1;
  background-color: var(--rnp-primary, #2563eb) !important;
  color: var(--rnp-btn-text, #ffffff) !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 13px 20px !important;
  font-size: 14px !important;
  font-weight: 800 !important;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.2s ease;
}

.rnp-btn-primary:hover {
  transform: translateY(-1px);
}

.rnp-btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.rnp-btn-secondary {
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--rnp-body-border, #cbd5e1);
  color: var(--rnp-text, #0f172a) !important;
  text-decoration: none !important;
  font-size: 13px;
  font-weight: 700;
}

@keyframes rnpShake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-7px); }
  40%, 80% { transform: translateX(7px); }
}

.rnp-shake {
  animation: rnpShake 0.45s ease both !important;
}
`;

  const popupJs = `/**
 * RokhNet Notice Pro v2.0 - Multi-Notice Priority Queue Controller (Zero jQuery, Zero DB Bloat)
 * Developer: ${config.developerName} (${config.developerPhone}) - ${config.developerUrl}
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof window.rnpQueueConfig === 'undefined' || !Array.isArray(window.rnpQueueConfig.notices)) {
      return;
    }

    var queueMode = window.rnpQueueConfig.queueMode || 'priority_sequential';
    var notices = window.rnpQueueConfig.notices;

    function getStorageKey(notice) {
      return 'rnp_ack_' + notice.id + '_v_' + notice.noticeVersion;
    }

    function hasAccepted(notice) {
      var key = getStorageKey(notice);
      try {
        if (notice.storageMethod === 'session_only') {
          return sessionStorage.getItem(key) === 'true';
        }
        if (localStorage.getItem(key) === 'true') return true;
        if (document.cookie.indexOf(key + '=true') !== -1) return true;
      } catch (e) {}
      return false;
    }

    function saveAccepted(notice) {
      var key = getStorageKey(notice);
      try {
        if (notice.storageMethod === 'session_only') {
          sessionStorage.setItem(key, 'true');
        } else {
          localStorage.setItem(key, 'true');
          var d = new Date();
          d.setTime(d.getTime() + ((notice.cookieExpireDays || 30) * 86400000));
          document.cookie = key + '=true;expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
        }
      } catch (e) {}
    }

    // Filter unaccepted notices in priority order
    var pendingQueue = notices.filter(function (n) {
      return !hasAccepted(n);
    });

    if (pendingQueue.length === 0) return;

    var currentIndex = 0;

    function activateNoticeInQueue(index) {
      if (index >= pendingQueue.length) return;
      var notice = pendingQueue[index];
      var overlay = document.getElementById('rnp-overlay-' + notice.id);
      var card = document.getElementById('rnp-card-' + notice.id);
      var checkbox = document.getElementById('rnp-check-' + notice.id);
      var acceptBtn = document.getElementById('rnp-accept-' + notice.id);
      var acceptLabel = document.getElementById('rnp-accept-label-' + notice.id);
      var errorMsg = document.getElementById('rnp-error-' + notice.id);
      var closeBtn = overlay ? overlay.querySelector('[data-rnp-close]') : null;

      if (!overlay || !acceptBtn) return;

      function triggerShake() {
        if (!card) return;
        card.classList.remove('rnp-shake');
        void card.offsetWidth;
        card.classList.add('rnp-shake');
      }

      var remainingSeconds = parseInt(notice.countdownSeconds, 10) || 0;
      var timerInterval = null;

      function showModal() {
        overlay.removeAttribute('hidden');
        requestAnimationFrame(function () {
          overlay.classList.add('rnp-visible');
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
        overlay.classList.remove('rnp-visible');
        setTimeout(function () {
          overlay.setAttribute('hidden', 'hidden');
          if (queueMode === 'priority_sequential' && index + 1 < pendingQueue.length) {
            currentIndex = index + 1;
            activateNoticeInQueue(currentIndex);
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
        if (e.key === 'Escape' && overlay.classList.contains('rnp-visible')) {
          if (notice.preventEscClose) {
            e.preventDefault();
            triggerShake();
          } else {
            closeModalAndAdvance();
          }
        }
      });

      // Handle Trigger
      if (index > 0) {
        // Subsequent notices in queue open immediately after previous one is accepted
        showModal();
      } else if (notice.triggerType === 'delay') {
        setTimeout(showModal, (notice.delaySeconds || 1) * 1000);
      } else if (notice.triggerType === 'scroll') {
        var scrollTriggered = false;
        window.addEventListener('scroll', function () {
          if (scrollTriggered) return;
          var pct = (window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)) * 100;
          if (pct >= (notice.scrollPercentage || 25)) {
            scrollTriggered = true;
            showModal();
          }
        });
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

  const readmeTxt = `=== RokhNet Notice Pro | افزونه اطلاعیه و تعهدنامه هوشمند رخ‌نت (نسخه 2.0) ===
Contributors: miladriahi
Author: ${config.developerName}
Author URI: ${config.developerUrl}
Support Phone: ${config.developerPhone}
Requires at least: ${config.wpVersion}
Tested up to: ${config.wpVersion}
Requires PHP: ${config.phpVersion}
WC requires at least: ${config.wcVersion}
WC tested up to: ${config.wcVersion}
Stable tag: 2.0.0
License: GPLv2 or later

سیستم جامع، چندگانه و فوق‌سبک پاپ‌آپ اطلاعیه، قوانین سایت و تعهدنامه با چک‌باکس تایید اجباری ویژه وردپرس و ووکامرس.

== تغییرات و ویژگی‌های کلیدی نسخه 2.0 ==

* **مدیریت چندگانه اطلاعیه‌ها (Multi-Notice CRUD)**: امکان تعریف بی‌نهایت پاپ‌آپ مجزا با استایل، رنگ‌بندی، اولویت و صفحات هدف اختصاصی به همراه ویرایش، کپی و حذف.
* **ارث‌بری کامل فونت از قالب وردپرس**: بدون لود هیچ‌گونه فونت اضافی؛ پاپ‌آپ‌ها به صورت خودکار با فونت قالب سایت شما نمایش داده می‌شوند.
* **تنظیم هوشمند رنگ‌ها با خوانایی ۱۰۰٪**: ۶ استایل مدرن (روشن و تیره) که در هر استایل رنگ پس‌زمینه، متن، کادر داخلی و دکمه‌ها با بالاترین کنتراست تنظیم می‌شوند.
* **نمایش قطعی آیکون‌های برداری (Inline SVG)**: رندر مستقیم آیکون‌ها در کدهای HTML بدون وابستگی به فونت‌آیکون خارجی.
* **کنترل فعال/غیرفعال‌سازی تک‌تک عناوین**: امکان روشن یا خاموش کردن نمایش آیکون، سوتیتر، عنوان اصلی و زیرعنوان به صورت مجزا.
* **لود شرطی در صفحات انتخابی (بدون افت سرعت سایت)**: اگر صفحه‌ای پاپ‌آپ فعال نداشته باشد، هیچ فایل CSS یا JS در آن صفحه لود نمی‌شود.
* **بدون سنگین کردن دیتابیس (Zero DB Bloat)**: حذف جداول لاگ سنگین و ذخیره وضعیت تایید کاربر صرفاً در کوکی و LocalStorage مرورگر.

== پشتیبانی و توسعه ==
توسعه‌دهنده: ${config.developerName}
تلفن تماس: ${config.developerPhone}
وبسایت رسمی: ${config.developerUrl}
`;

  return [
    {
      path: 'rokhnet-notice-pro/rokhnet-notice-pro.php',
      filename: 'rokhnet-notice-pro.php',
      language: 'php',
      description: 'فایل اصلی نسخه ۲.۰، ذخیره بهینه بدون جدول اضافی دیتابیس و موتور رندر آیکون‌های برداری SVG',
      content: mainPhp,
    },
    {
      path: 'rokhnet-notice-pro/includes/class-rnp-admin.php',
      filename: 'includes/class-rnp-admin.php',
      language: 'php',
      description: 'داشبورد مدیریت چندگانه اطلاعیه‌ها (افزودن، ویرایش، کپی، حذف، اولویت‌بندی) و تطبیق خودکار رنگ استایل‌ها',
      content: adminPhp,
    },
    {
      path: 'rokhnet-notice-pro/includes/class-rnp-frontend.php',
      filename: 'includes/class-rnp-frontend.php',
      language: 'php',
      description: 'موتور لود شرطی در صفحات انتخابی (بدون افت سرعت سایت)، نمایش آیکون SVG و کنترل نمایش عناوین',
      content: frontendPhp,
    },
    {
      path: 'rokhnet-notice-pro/assets/css/rnp-popup.css',
      filename: 'assets/css/rnp-popup.css',
      language: 'css',
      description: 'استایل‌شیت با ارث‌بری فونت از قالب وردپرس (font-family: inherit) و تضمین خوانایی رنگ‌ها در ۶ پوسته',
      content: popupCss,
    },
    {
      path: 'rokhnet-notice-pro/assets/js/rnp-popup.js',
      filename: 'assets/js/rnp-popup.js',
      language: 'javascript',
      description: 'مدیریت صف اولویت پاپ‌آپ‌ها (Priority Queue) و ذخیره سبک در کوکی/لوکال‌استوریج بدون بار روی دیتابیس',
      content: popupJs,
    },
    {
      path: 'rokhnet-notice-pro/readme.txt',
      filename: 'readme.txt',
      language: 'text',
      description: 'راهنمای نصب و مستندات نسخه ۲.۰ با مشخصات توسعه‌دهنده (میلاد ریاحی - رخ‌نت)',
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
  link.download = 'rokhnet-notice-pro-v2.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
