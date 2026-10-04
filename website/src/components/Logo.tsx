import appIconUrl from "../assets/app-icon.png";
import { cn } from "../lib/utils";

/**
 * 网站品牌图标，与桌面端使用同一原图的尺寸派生资源。
 * 纯装饰：alt 留空避免读屏重复播报，draggable=false 防止拖出图片文件。
 */
export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <img
      alt=""
      className={cn("app-icon", className)}
      draggable={false}
      height={size}
      src={appIconUrl}
      width={size}
    />
  );
}
