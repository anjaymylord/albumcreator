const { Telegraf } = require("telegraf");
const TelegrafI18n = require("telegraf-i18n");
const TelegrafLocalSession = require("telegraf-session-local");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

// Prepare i18n
const i18n = new TelegrafI18n({
  defaultLanguage: "en",
  allowMissing: true,
  directory: path.resolve(__dirname, "locales"),
});

// Prepare sessions
const LocalSession = new TelegrafLocalSession({
  storage: TelegrafLocalSession.storageMemory,
});

// Create bot and load middlewares
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(i18n.middleware());
bot.use(LocalSession.middleware());

//
// Bot logic
//

// ... Your existing code ...

// Function to add watermark to an image
const addTextWatermark = async (image, text) => {
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
// atur kapasitas kalimat anda
  ctx.globalAlpha = 0.5; // artinya 50% 
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Telegram @mediapeler", 10, 30);
  return canvas.toBuffer();
};

// ... Your existing code ...

// Finish album creation
bot.hears(
  TelegrafI18n.match("keyboard_done"),
  async ({ i18n, reply, replyWithMediaGroup, session }) => {
    // ... Your existing code ...

    try {
      for (let i = 0; i < pages; i++) {
        // ... Your existing code ...

        // Add watermark to each photo in the album
        for (const mediaItem of mediaToSend) {
          if (mediaItem.type === "photo") {
            const image = await loadImage(
              `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${mediaItem.media}`
            );

            const watermarkedImage = await addTextWatermark(
              image,
              "Teks Watermark Anda"
            );

            // Save the watermarked photo temporarily to storage
            const tempFilePath = `./temp_${mediaItem.media}.jpg`;
            fs.writeFileSync(tempFilePath, watermarkedImage);

            // Send the watermarked photo to the media group
            await replyWithMediaGroup([
              {
                type: "photo",
                media: {
                  source: tempFilePath,
                },
              },
            ]);

            // Delete the temporary watermarked photo
            fs.unlinkSync(tempFilePath);
          } else if (mediaItem.type === "video") {
            // If the media type is video, add video watermark logic here (optional).
            // You can use ffmpeg or other libraries to add video watermark.
          }
        }
      }
    } catch (error) {
      // ... Your existing code ...
    }
  }
);

// ... Your existing code ...

// Start the bot
console.log(
  `Starting longPolling (chat_id of bot: ${
    process.env.BOT_TOKEN.split(":")[0]
  })...`
);
bot.launch();
