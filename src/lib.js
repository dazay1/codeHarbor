// Lesson preview support. The learner writes HTML, so it is cleaned before it is shown.
const BLOCKED = 'script,style,iframe,object,embed,link,meta,base,form,svg,math';

/** Removes scripts, forms, inline handlers, styles and src attributes from learner HTML. */
export function sanitize(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll(BLOCKED).forEach((n) => n.remove());
  doc.body.querySelectorAll('*').forEach((el) => {
    [...el.attributes].forEach((a) => {
      const n = a.name.toLowerCase();
      if (n.startsWith('on') || n === 'style' || n === 'srcdoc' || n === 'src' || n === 'formaction') {
        el.removeAttribute(a.name);
      }
    });
  });
  return doc.body.innerHTML;
}
