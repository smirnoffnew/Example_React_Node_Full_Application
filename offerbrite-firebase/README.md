#Offerbrite Firebase cloud functions

Start
```bash
cd functions
sudo yarn add global firebase-tools
firebase login
yarn
yarn deploy
```

You need to set environment variables with command
```bash
firebase functions:config:set image_compressor.image_compressed_height=1600
firebase functions:config:set image_compressor.image_compressed_width=1600

```
