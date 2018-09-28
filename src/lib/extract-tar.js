import {extract} from 'gittar';

const RGX = /\.(woff2?|ttf|eot|jpe?g|ico|png|gif|mp4|mov|ogg|webm)(\?.*)?$/i;
const isMedia = str => RGX.test(str);

export default (archive, target) =>
  new Promise(async resolve => { // eslint-disable-line no-async-promise-executor
    const keeps = [];
    await extract(archive, target, {
      filter(path, obj) {
        if (path.includes('/.github')) {
          return false;
        }

        obj.on('end', () => {
          if (obj.type === 'File' && !isMedia(obj.path)) {
            keeps.push(obj.absolute);
          }
        });
        return true;
      }
    });
    resolve(keeps);
  });
