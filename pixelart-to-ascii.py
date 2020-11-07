from PIL import Image, GifImagePlugin
from json import dumps
import argparse
import os.path


def getColors(im):
    width, height = im.size
    dict_num = dict(im.getcolors(width*height))
    dict_rgb = dict(im.convert('RGB').getcolors(width*height))
    return {str(dict_num[key]): f'rgb{dict_rgb[key]}' for key in dict_rgb}

def imgToList(img):
    pixels = list(img.getdata())
    width, height = img.size
    return [pixels[i * width:(i + 1) * width] for i in range(height)]

def getPixelSize(img):
    equals = 0
    row = img[0]

    for i in range(len(img)):
        if img[1] == row:
            equals = equals+1
            row = img[i+1]

    return equals

def resizeImg(img, pixSize):
    y_resized = [elem for num, elem in enumerate(img) if elem not in img[:num]]
    # print(y_resized)
    new_img = []
    for row in y_resized:
        # print(row)
        new_img.append(row[::pixSize])
    return new_img

def getAscii(img_arr):
    newImg = ""
    for x in img_arr:
        newImg += ''.join([str(y) for y in x])
        newImg += '\n'
    return newImg

def printAscii(img_arr):
    print(getAscii(img_arr))

def _writeDown(data, file):
    with open(file, 'w') as f:
        f.write(data)

def toPlainText(images: list, colors: dict, file: str):
    str_colors = '\n'.join([f'{x}: {colors[x]}' for x in colors])
    if len(images) == 1:
        _writeDown(f'{images[0]}\n\n{str_colors}', f'{file}.txt')
    else:
        n = 1
        for img in images:
            _writeDown(f'{img}\n\n{str_colors}', f'{file}_{n}.txt')
            n = n+1

def toJson(images: list, colors: dict, file: str):
    json_dict = {
        "images": images,
        "colors": colors
    }
    _writeDown(dumps(json_dict), f'{file}.json')

def processImg(pil_image):
    im_pixels = imgToList(pil_image)
    im_resized = resizeImg(im_pixels, getPixelSize(im_pixels))
    return getAscii(im_resized)

def processGif(pil_image):
    frames = []
    for frame in range(0, pil_image.n_frames):
        pil_image.seek(frame)
        frames.append(processImg(pil_image))
    return frames


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
    description='Convert pixelart image to ascii art')

    parser.add_argument('image', metavar='img', help='Image (gif, png)')
    parser.add_argument('--json', action="store_true", help='Output result json file')

    args = parser.parse_args()

    im_file_name = os.path.split(args.image)[-1]

    im = Image.open(args.image)
    colors = getColors(im)

    ascii_img_list = processGif(im) if im.is_animated else [processImg(im)]

    if args.json:
        toJson(ascii_img_list, colors, im_file_name)
    else:
        toPlainText(ascii_img_list, colors, im_file_name)
