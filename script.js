const wishes = [
  'Chúc bạn một ngày 20/10 ngập tràn niềm vui, yêu thương và những điều thật xinh đẹp. Hãy luôn rạng rỡ theo cách của riêng mình nhé!',
  'Mong bạn luôn được là chính mình, luôn có những ngày bình yên, những giấc mơ thật lớn và thật nhiều người yêu thương bên cạnh. Chúc mừng 20/10!',
  'Ngày 20/10, chúc bạn nhận được những bó hoa đẹp nhất, những nụ cười ấm nhất và mọi điều tốt lành mà bạn xứng đáng có được.',
  'Cảm ơn vì đã mang đến cho thế giới này một sắc màu thật riêng. Chúc bạn hôm nay và mọi ngày đều hạnh phúc, tự tin và tỏa sáng!'
];

const recipientInput = document.querySelector('#recipient');
const senderInput = document.querySelector('#sender');
const previewRecipient = document.querySelector('#preview-recipient');
const previewSender = document.querySelector('#preview-sender');
const previewMessage = document.querySelector('#preview-message');
const status = document.querySelector('#action-status');
const overlay = document.querySelector('#letter-overlay');
const dialog = overlay.querySelector('.letter-dialog');
let wishIndex = 0;
let previousFocus = null;

function updatePreview() {
  previewRecipient.textContent = recipientInput.value.trim() || 'người đặc biệt';
  previewSender.textContent = senderInput.value.trim() || 'một người luôn nghĩ về bạn';
  status.textContent = '';
}

recipientInput.addEventListener('input', updatePreview);
senderInput.addEventListener('input', updatePreview);

document.querySelector('#change-wish').addEventListener('click', () => {
  wishIndex = (wishIndex + 1) % wishes.length;
  previewMessage.textContent = wishes[wishIndex];
  status.textContent = 'Đã đổi lời chúc ♡';
});

document.querySelector('#copy-wish').addEventListener('click', async () => {
  const recipient = recipientInput.value.trim() || 'người đặc biệt';
  const sender = senderInput.value.trim() || 'một người luôn nghĩ về bạn';
  const message = `Gửi ${recipient},\n\n${wishes[wishIndex]}\n\nThương mến,\n${sender}`;
  try {
    await navigator.clipboard.writeText(message);
    status.textContent = 'Đã sao chép! Giờ bạn có thể gửi lời chúc đi rồi ♡';
  } catch {
    const field = document.createElement('textarea');
    field.value = message;
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    status.textContent = copied ? 'Đã sao chép! Giờ bạn có thể gửi lời chúc đi rồi ♡' : 'Không thể sao chép tự động. Hãy chọn và sao chép nội dung trên thiệp nhé.';
  }
});

function openLetter() {
  previousFocus = document.activeElement;
  overlay.hidden = false;
  document.body.classList.add('modal-open');
  dialog.focus();
}

function closeLetter() {
  overlay.hidden = true;
  document.body.classList.remove('modal-open');
  previousFocus?.focus();
}

document.querySelector('#open-letter').addEventListener('click', openLetter);
document.querySelectorAll('[data-close-letter]').forEach(button => button.addEventListener('click', closeLetter));
document.querySelector('#make-your-card').addEventListener('click', () => {
  closeLetter();
  document.querySelector('#tao-thiep').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => recipientInput.focus({ preventScroll: true }), 450);
});

document.addEventListener('keydown', event => {
  if (overlay.hidden) return;
  if (event.key === 'Escape') closeLetter();
  if (event.key === 'Tab') {
    const focusable = [...dialog.querySelectorAll('button')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (document.activeElement === dialog) {
      event.preventDefault();
      first.focus();
    }
  }
});
