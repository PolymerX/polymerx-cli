
export default function error(text, oraInstance) {
  oraInstance.fail(text);
  oraInstance.stop();
}
