from PIL import Image
from json import dump
import argparse


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

def toJson(image, colors, filename='ascii_data.json'):
    json_dict = {
        "image": getAscii(image),
        "colors": colors
    }

    with open(filename, 'w') as f:
        dump(json_dict, f)

def toPlainText(image, colors, filename='ascii_data.txt'):
    with open(filename, 'w') as f:
        f.write(getAscii(image))
        f.write('\n\n')
        f.write('\n'.join([f'{x}: {im_colors[x]}' for x in im_colors]))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
    description='Convert pixelart image to ascii art')

    parser.add_argument('image', metavar='img', help='Image (gif, png)')
    parser.add_argument('-o', '--out', metavar='output', help='Output result as plain text')
    parser.add_argument('--json', metavar='json', help='Output result json file')

    args = parser.parse_args()

    im = Image.open(args.image)
    im_pixels = imgToList(im)
    im_resized = resizeImg(im_pixels, getPixelSize(im_pixels))
    im_colors = getColors(im)

    if args.out:
        toPlainText(im_resized, im_colors, args.out)
    if args.json:
        toJson(im_resized, im_colors, args.json)
    if not args.json and not args.out:
        printAscii(im_resized)
        print('\n'.join([f'{x}: {im_colors[x]}' for x in im_colors]))



    # pixels = imgToList(im)
    # img_colors = getColors(im)
    # pix_size = getPixelSize(pixels)
    # one_pixel_img = resizeImg(pixels, pix_size)
    # # printAscii(one_pixel_img)
    # # print(getColors(im))
    # toJson(getAscii(one_pixel_img), img_colors)
