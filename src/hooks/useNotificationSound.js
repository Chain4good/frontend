export const useNotificationSound = () => {
  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification-sound.mp3");
    audio.volume = 0.5;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error("Error playing sound:", error);
      });
    }
  };

  return { playNotificationSound };
};
