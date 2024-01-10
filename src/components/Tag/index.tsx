/**
 * Author: Libra
 * Date: 2024-01-09 10:28:03
 * LastEditors: Libra
 * Description:
 */
interface ITagProps {
  id: string;
  name: string;
}
export const TagCom: React.FC<{
  tag: ITagProps;
}> = ({ tag }) => {
  return (
    <div className="h-5 text-xs inline-flex px-2 py-1 justify-center items-center rounded bg-[var(--primary-color-20)] text-[var(--primary-color)]">
      {tag.name}
    </div>
  );
};
