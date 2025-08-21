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

  // ファイル処理・プレビュー
  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      previewArea.innerHTML = '<span style="color:red">画像ファイルを選択してください</span>';
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      previewArea.innerHTML = `<img src="${e.target.result}" alt="プレビュー画像" style="max-width:100%;max-height:240px;border-radius:8px;">`;
    };
    reader.readAsDataURL(file);
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

  // 処理開始ボタン（ダミー）
  const processBtn = document.getElementById('process-btn');
  if (processBtn) {
    processBtn.addEventListener('click', () => {
      alert('画像処理を開始します（機能は未実装）');
    });
  }

  // SNS共有ボタンの動作実装
  document.querySelectorAll('.sns-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = location.href;
      const text = '間違い探し生成アプリで画像をアップロードしました！';
      let shareUrl = '';
      switch (btn.getAttribute('aria-label')) {
        case 'Xで共有':
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
          break;
        case 'Facebookで共有':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
          break;
        case 'LINEで共有':
          shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;
          break;
        default:
          alert('未対応のSNSです');
          return;
      }
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    });
  });

});
