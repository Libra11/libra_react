/**
 * Author: Libra
 * Date: 2023-12-27 14:31:51
 * LastEditors: Libra
 * Description:
 */

export const BlogView: React.FC = () => {
  const initListener = () => {
    setTimeout(() => {
      const markers = document.querySelectorAll("#editorjs2 .cdx-marker");
      console.log("markers", markers);
      markers.forEach((marker) => {
        marker.addEventListener("click", () => {
          const data = (marker as HTMLElement).dataset;
          console.log("data", data.example, data.pronunciation, data.word);
        });
      });
    }, 100);
  };
  return <div>BlogView</div>;
};
