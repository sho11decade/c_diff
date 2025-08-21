// main.js - 間違い探し生成アプリ UI・機能
// 保守性・拡張性を考慮した実装

document.addEventListener('DOMContentLoaded', () => {
  // 要素取得
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const previewArea = document.createElement('div');
  previewArea.className = 'preview-area';
  previewArea.id = 'preview-area';
  previewArea.setAttribute('aria-live', 'polite');
  // アップロードエリアの直後にプレビューエリアを追加
  uploadArea.parentNode.appendChild(previewArea);

  // ドラッグ&ドロップ対応
  uploadArea.addEventListener('click', () => fileInput.click());
  uploadArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') fileInput.click();
  });

  ['dragenter', 'dragover'].forEach(evt => {
    uploadArea.addEventListener(evt, e => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach(evt => {
    uploadArea.addEventListener(evt, e => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
    });
  });
  uploadArea.addEventListener('drop', e => {
    const files = e.dataTransfer.files;
    if (files && files[0]) handleFile(files[0]);
  });

  // ファイル選択
  fileInput.addEventListener('change', e => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  });

  // スライダーの値を表示
  const difficultySlider = document.getElementById('difficulty-slider');
  const sliderValue = document.getElementById('slider-value');
  if (difficultySlider && sliderValue) {
    // 初期値表示
    sliderValue.textContent = difficultySlider.value;
    // 値変更時に表示を更新
    difficultySlider.addEventListener('input', () => {
      sliderValue.textContent = difficultySlider.value;
    });
  }

  // アクセシビリティ: dragover時の視覚効果
  uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.style.borderColor = '#2792c3';
  });
  uploadArea.addEventListener('dragleave', e => {
    uploadArea.style.borderColor = '';
  });
  uploadArea.addEventListener('drop', e => {
    uploadArea.style.borderColor = '';
  });

  // 処理開始ボタン（ファイル選択時のみ有効化）
  const processBtn = document.getElementById('process-btn');
  let fileSelected = false;
  
  processBtn.addEventListener('click', async () => {
    if (!fileSelected) return;

    const formData = new FormData();
    const file = fileInput.files[0];
    const difficulty = difficultySlider ? difficultySlider.value : 5;

    formData.append('file', file);
    formData.append('difficulty', difficulty);

    try {
      processBtn.disabled = true;
      processBtn.textContent = '処理中...';

      // ファイルアップロード
      const uploadResponse = await fetch('/upload', {
        method: 'POST',
        body: formData
      });

      if (uploadResponse.ok) {
        // 難易度設定を /config_info に送信
        const configResponse = await fetch('/config_info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `difficulty=${encodeURIComponent(difficulty)}`
        });
        if (configResponse.ok) {
          const configResult = await configResponse.json();
          console.log('難易度設定送信成功:', configResult);
        } else {
          console.error('難易度設定送信失敗:', configResponse.statusText);
        }
        // アップロード結果の表示など（必要に応じて）
        // const result = await uploadResponse.json();
        // console.log('アップロード成功:', result);
      } else {
        console.error('アップロード失敗:', uploadResponse.statusText);
      }
    } catch (error) {
      console.error('エラー:', error);
    } finally {
      processBtn.disabled = false;
      processBtn.textContent = '処理開始';
    }
  });

  function setProcessBtnState(enabled) {
    if (processBtn) {
      processBtn.disabled = !enabled;
      processBtn.style.opacity = enabled ? '1' : '0.5';
      processBtn.style.pointerEvents = enabled ? 'auto' : 'none';
    }
  }
  setProcessBtnState(false);

  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      previewArea.innerHTML = '<span style="color:red">画像ファイルを選択してください</span>';
      fileSelected = false;
      setProcessBtnState(false);
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      previewArea.innerHTML = `<img src="${e.target.result}" alt="プレビュー画像" style="max-width:100%;max-height:240px;border-radius:8px;">`;
      fileSelected = true;
      setProcessBtnState(true);
    };
    reader.readAsDataURL(file);
  }
});
