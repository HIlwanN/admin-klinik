# Icon Files

Letakkan icon aplikasi di folder ini:

## Required Files

1. **icon.ico** (Windows) - 256x256 pixels minimum
2. **icon.icns** (macOS) - 512x512 pixels minimum  
3. **icon.png** (Linux) - 512x512 pixels minimum

## Cara Membuat Icon

### Dari PNG ke ICO/ICNS

Gunakan tools online:
- https://icoconvert.com/
- https://cloudconvert.com/png-to-ico
- https://cloudconvert.com/png-to-icns

### Rekomendasi Desain

- Ukuran: 512x512 pixels
- Format: PNG dengan transparent background
- Desain: Simple, clean, dan recognizable
- Warna: Sesuai dengan tema aplikasi

## Default Behavior

Jika icon tidak tersedia, Electron akan menggunakan icon default.

## Testing

Setelah menambah icon, test dengan:

```bash
npm run electron:build:win
```

Icon akan muncul di:
- Installer
- Desktop shortcut
- Taskbar
- Title bar aplikasi

