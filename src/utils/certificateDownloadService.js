/**
 * Platform-Aware Certificate Download Service
 * 
 * Supports:
 * 1. Web Browsers (Chrome, Safari, Firefox, Edge): Preserves native HTML5 file download (<a download>).
 * 2. React Native App (iOS & Android WebViews): Performs a real native file download by bridging
 *    the certificate data/PDF payload to the React Native container via window.ReactNativeWebView.postMessage.
 */

// Helper to sanitize filenames across Windows, macOS, Android & iOS
export const sanitizeFilename = (name, defaultExt = 'png') => {
  if (!name) return `TherapyMantra_Certificate.${defaultExt}`;
  const cleanName = name.trim().replace(/[^a-zA-Z0-9_\-.]/g, '_');
  if (cleanName.endsWith('.pdf') || cleanName.endsWith('.png')) {
    return cleanName;
  }
  return `${cleanName}.${defaultExt}`;
};

// Validates PDF or PNG data URL / binary payload
export const validateCertificatePayload = (payload) => {
  if (!payload) return { valid: false, reason: 'Empty payload' };

  if (typeof payload === 'string') {
    if (payload.startsWith('data:image/png') || payload.startsWith('data:image/jpeg')) {
      return { valid: true, mimeType: payload.split(';')[0].replace('data:', ''), isImage: true };
    }
    if (payload.startsWith('data:application/pdf') || payload.startsWith('%PDF-')) {
      return { valid: true, mimeType: 'application/pdf', isPdf: true };
    }
    if (payload.startsWith('data:')) {
      return { valid: true, mimeType: payload.split(';')[0].replace('data:', '') };
    }
  }

  return { valid: true, mimeType: 'application/octet-stream' };
};

/**
 * Downloads / exports the certificate natively or via web anchor
 */
export const downloadCertificate = async ({
  url,
  dataUrl,
  fileName = 'TherapyMantra_Certificate.png',
  userName = '',
  certificateId = '',
  showToast
}) => {
  const targetPayload = dataUrl || url;

  // 1. Validation
  const validation = validateCertificatePayload(targetPayload);
  if (!validation.valid) {
    if (import.meta.env?.DEV || process.env.NODE_ENV !== 'production') {
      console.error('[CertificateDownloadService] Validation failed:', {
        reason: validation.reason,
        url,
        dataLength: dataUrl ? dataUrl.length : 0
      });
    }
    if (showToast) {
      showToast('Unable to download your certificate. Please try again.', 'error');
    }
    return false;
  }

  const defaultExt = validation.isPdf ? 'pdf' : 'png';
  const cleanFilename = sanitizeFilename(fileName, defaultExt);

  // 2. Authentication Context Extraction
  let authData = { token: '', service: '', uid: '' };
  try {
    if (typeof window !== 'undefined') {
      authData.token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
      const params = new URLSearchParams(window.location.search || '');
      authData.service = params.get('service') || params.get('source') || '';
      authData.uid = params.get('uid') || params.get('upa_id') || '';
    }
  } catch (e) { }

  const isRNWebView = typeof window !== 'undefined' && !!window.ReactNativeWebView;

  // Development mode logging (Hides sensitive token)
  if (import.meta.env?.DEV || process.env.NODE_ENV !== 'production') {
    console.log('[CertificateDownloadService] Download Request:', {
      fileName: cleanFilename,
      certificateId,
      mimeType: validation.mimeType,
      isRNWebView,
      hasAuthToken: !!authData.token,
      payloadSize: targetPayload ? `${Math.round(targetPayload.length / 1024)} KB` : 'N/A'
    });
  }

  // 3. REACT NATIVE NATIVE DOWNLOAD BRIDGE
  if (isRNWebView) {
    try {
      if (showToast) {
        showToast('Certificate ready - saving to device…', 'info');
      }

      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'DOWNLOAD_CERTIFICATE_NATIVE',
        action: 'download_certificate',
        fileType: validation.mimeType.includes('pdf') ? 'pdf' : 'png',
        dataUrl: dataUrl || '',
        url: url || '',
        filename: cleanFilename,
        userName: userName.trim(),
        certificateId,
        auth: {
          token: authData.token,
          service: authData.service,
          uid: authData.uid
        }
      }));

      return true;
    } catch (rnErr) {
      if (import.meta.env?.DEV || process.env.NODE_ENV !== 'production') {
        console.error('[CertificateDownloadService] Native postMessage bridge error:', rnErr);
      }
      if (showToast) {
        showToast('Unable to download your certificate. Please try again.', 'error');
      }
      return false;
    }
  }

  // 4. WEB BROWSER FILE DOWNLOAD (Preserves Web Implementation)
  if (typeof document !== 'undefined') {
    try {
      let downloadUrl = targetPayload;
      let createdBlobUrl = null;

      // Convert Data URI to Blob URL for reliable browser downloading
      if (typeof targetPayload === 'string' && targetPayload.startsWith('data:')) {
        try {
          const res = await fetch(targetPayload);
          const blob = await res.blob();
          createdBlobUrl = URL.createObjectURL(blob);
          downloadUrl = createdBlobUrl;
        } catch (blobErr) {
          downloadUrl = targetPayload;
        }
      }

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = cleanFilename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        try {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
          if (createdBlobUrl) {
            URL.revokeObjectURL(createdBlobUrl);
          }
        } catch (e) { }
      }, 3000);

      if (showToast) {
        showToast('Certificate downloaded successfully.', 'success');
      }
      return true;
    } catch (webErr) {
      if (import.meta.env?.DEV || process.env.NODE_ENV !== 'production') {
        console.error('[CertificateDownloadService] Web download error:', webErr);
      }
      if (showToast) {
        showToast('Unable to download your certificate. Please try again.', 'error');
      }
      return false;
    }
  }

  return false;
};
