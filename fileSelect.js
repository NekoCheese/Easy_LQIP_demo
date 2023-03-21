const fileInput = document.getElementById("fileInput");

// 監聽 input 欄位的改變
fileInput.addEventListener("change", handleFileSelect);

function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  const image = new Image();

  // 當讀取完成後執行以下程式碼
  reader.addEventListener("load", (event) => {
    // 當圖片載入完成後執行以下程式碼
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    image.addEventListener("load", () => {
      const MAX_WIDTH = 500;
      const MAX_HEIGHT = 500;

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

      const highQualityImage = dataURItoBlob(image.src);
      const lowQualityImage = dataURItoBlob(
        canvas.toDataURL("image/jpeg", 0.1)
      );

      saveImage(highQualityImage, file.name);
      saveImage(lowQualityImage, `${file.name.split(".")[0]}_lqip.jpg`);

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

      image.removeEventListener("load", {});
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
