/**
 * Author: Libra
 * Date: 2024-01-08 15:55:21
 * LastEditors: Libra
 * Description:
 */
import { useMemo } from "react";

interface SvgIconProps {
  prefix?: string;
  name: string;
  color?: string;
  size?: number | string;
}

const SvgIcon = (props: SvgIconProps) => {
  const { prefix = "icon", name, color, size = 16 } = props;
  const symbolId = useMemo(() => `#${prefix}-${name}`, [prefix, name]);
  return (
    <svg aria-hidden="true" width={size} height={size} fill={color}>
      <use href={symbolId} fill={color} color={color} />
    </svg>
  );
};
export default SvgIcon;
