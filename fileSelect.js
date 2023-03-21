const fileInput = document.getElementById("fileInput");
const image = new Image();

// 監聽 input 欄位的改變
fileInput.addEventListener("change", handleFileSelect);

function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  // 當讀取完成後執行以下程式碼
  reader.addEventListener("load", (event) => {
    // 當圖片載入完成後執行以下程式碼
    image.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // 縮小圖片尺寸
      const MAX_WIDTH = 500; // 設定最大寬度
      const MAX_HEIGHT = 500; // 設定最大高度

      if (image.width > MAX_WIDTH || image.height > MAX_HEIGHT) {
        const scale = Math.min(
          MAX_WIDTH / image.width,
          MAX_HEIGHT / image.height
        );
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
      } else {
        canvas.width = image.width;
        canvas.height = image.height;
      }

      // 繪製低畫質圖片
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.5;
      ctx.filter = "blur(5px)";
      ctx.drawImage(
        canvas,
        0,
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // 儲存高畫質圖片和低畫質圖片
      const highQualityImage = dataURItoBlob(image.src);

      const lowQualityImage = dataURItoBlob(
        canvas.toDataURL("image/jpeg", 0.1)
      );

      // document.getElementById("previewImg").innerHTML = "";

      // 儲存高畫質圖片並使用原檔案名稱
      saveImage(highQualityImage, file.name);

      // 儲存低畫質圖片並在檔名加上"_lqip"
      saveImage(lowQualityImage, `${file.name.split(".")[0]}_lqip.jpg`);
    });

    image.src = event.target.result;
  });

  reader.readAsDataURL(file);
}

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

function saveImage(blob, filename) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);

  // 設定下載的檔名
  a.download = filename;

  // 將下載連結加入到頁面中，並觸發點擊事件下載檔案
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // 解除 URL 物件的暫時性綁定
  URL.revokeObjectURL(url);

  const previewImg = document.getElementById("previewImg");
  while (previewImg.childNodes.length >= 2) {
    previewImg.removeChild(previewImg.firstChild);
  }

  // 新增新的圖片到預覽區塊中
  const img = new Image();
  img.src = URL.createObjectURL(blob);
  previewImg.appendChild(img);
}
