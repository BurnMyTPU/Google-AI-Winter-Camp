from xml.dom import minidom
import cv2
import os


def gen_i_fashion_train():
    base_dir = r'/home/chaopengzhangpku/workspace/dataset/i_Fashion_Devkit/fashion2019'
    lines = open(os.path.join(base_dir, 'test.txt'), 'r').readlines()
    cnt = 0
    for line in lines:
        create_xml(line.strip())
        cnt += 1
        if cnt % 1000 == 0:
            print(cnt)


def gen_train_test():
    base_dir = r'/Users/cpz/Downloads/Fashion Landmark Detection Benchmark/Eval'
    lines = open(os.path.join(base_dir, 'list_eval_partition.txt'), 'r').readlines()[2:]
    train_path = os.path.join(base_dir, 'train.txt')
    test_path = os.path.join(base_dir, 'test.txt')

    train = open('./train.txt', 'w')
    test = open('./test.txt', 'w')

    for line in lines:
        contents = line.strip().split(' ')
        filename = contents[0].replace('img/', '')
        print(filename)
        phase = contents[-1]
        if phase == 'train':
            train.write(filename + '\n')
        else:
            test.write(filename + '\n')
    print(train_path)
    train.close()
    test.close()


#
# def create_xml(line):
#     contents = line.strip().split(' ')
#     xml_dir = r'/home/chaopengzhangpku/workspace/dataset/i_Fashion_Devkit/fashion2019/Annotations'
#     img_dir = r'/home/chaopengzhangpku/workspace/dataset/i_Fashion_Devkit/fashion2019/JPEGImages'
#     folder_content = r'i_fashion'
#     filename_content = contents[0][4:]
#     jpg_path = os.path.join(img_dir, filename_content)
#     im = cv2.imread(jpg_path)
#     w = im.shape[1]
#     h = im.shape[0]
#     d = im.shape[2]
#     # print w,h,d
#     doc = minidom.Document()  # 创建DOM树对象
#
#     annotation = doc.createElement('annotation')  # 创建子节点
#     doc.appendChild(annotation)  # annotation作为doc树的子节点
#
#     folder = doc.createElement('folder')
#     folder.appendChild(doc.createTextNode(folder_content))  # 文本节点作为floder的子节点
#     annotation.appendChild(folder)  # folder作为annotation的子节点
#
#     filename = doc.createElement('filename')
#     filename.appendChild(doc.createTextNode(filename_content))
#     annotation.appendChild(filename)
#
#     filename = doc.createElement('path')
#     filename.appendChild(doc.createTextNode(jpg_path))
#     annotation.appendChild(filename)
#
#     source = doc.createElement('source')
#     database = doc.createElement('database')
#     database.appendChild(doc.createTextNode("Unknown"))
#     source.appendChild(database)
#     # annotation2 = doc.createElement('annotation')
#     # annotation2.appendChild(doc.createTextNode("ICDAR POD2017"))
#     # source.appendChild(annotation2)
#     # image = doc.createElement('image')
#     # image.appendChild(doc.createTextNode("image"))
#     # source.appendChild(image)
#     # flickrid = doc.createElement('flickrid')
#     # flickrid.appendChild(doc.createTextNode("NULL"))
#     # source.appendChild(flickrid)
#     annotation.appendChild(source)
#
#     # owner = doc.createElement('owner')
#     # flickrid = doc.createElement('flickrid')
#     # flickrid.appendChild(doc.createTextNode("NULL"))
#     # owner.appendChild(flickrid)
#     # na = doc.createElement('name')
#     # na.appendChild(doc.createTextNode("cxm"))
#     # owner.appendChild(na)
#     # annotation.appendChild(owner)
#
#     size = doc.createElement('size')
#     width = doc.createElement('width')
#     width.appendChild(doc.createTextNode("%d" % w))
#     size.appendChild(width)
#     height = doc.createElement('height')
#     height.appendChild(doc.createTextNode("%d" % h))
#     size.appendChild(height)
#     depth = doc.createElement('depth')
#     depth.appendChild(doc.createTextNode("%d" % d))
#     size.appendChild(depth)
#     annotation.appendChild(size)
#
#     segmented = doc.createElement('segmented')
#     segmented.appendChild(doc.createTextNode("0"))
#     annotation.appendChild(segmented)
#
#     object = doc.createElement('object')
#     nm = doc.createElement('name')
#     nm.appendChild(doc.createTextNode('fashion'))
#     object.appendChild(nm)
#     pose = doc.createElement('pose')
#     pose.appendChild(doc.createTextNode("Unspecified"))
#     object.appendChild(pose)
#
#     difficult = doc.createElement('difficult')
#     difficult.appendChild(doc.createTextNode("0"))
#     object.appendChild(difficult)
#     bndbox = doc.createElement('bndbox')
#     xmin = doc.createElement('xmin')
#     xmin.appendChild(doc.createTextNode(contents[1]))
#     bndbox.appendChild(xmin)
#     ymin = doc.createElement('ymin')
#     ymin.appendChild(doc.createTextNode(contents[2]))
#     bndbox.appendChild(ymin)
#     xmax = doc.createElement('xmax')
#     xmax.appendChild(doc.createTextNode(contents[3]))
#     bndbox.appendChild(xmax)
#     ymax = doc.createElement('ymax')
#     ymax.appendChild(doc.createTextNode(contents[4]))
#     bndbox.appendChild(ymax)
#     object.appendChild(bndbox)
#     annotation.appendChild(object)
#     savefile = open(os.path.join(xml_dir, filename_content.replace('.jpg', '.xml')), 'w')
#     savefile.write(doc.toprettyxml())
#     savefile.close()
#

def create_xml(line):
    xml_dir = r'/home/chaopengzhangpku/workspace/dataset/i_Fashion_Devkit/fashion2019/Annotations'
    img_dir = r'/home/chaopengzhangpku/workspace/dataset/i_Fashion_Devkit/fashion2019/JPEGImages'
    folder_content = r'i_fashion'
    filename_content = line
    jpg_path = os.path.join(img_dir, filename_content)
    im = cv2.imread(jpg_path)
    w = im.shape[1]
    h = im.shape[0]
    d = im.shape[2]
    # print w,h,d
    doc = minidom.Document()  # 创建DOM树对象

    annotation = doc.createElement('annotation')  # 创建子节点
    doc.appendChild(annotation)  # annotation作为doc树的子节点

    folder = doc.createElement('folder')
    folder.appendChild(doc.createTextNode(folder_content))  # 文本节点作为floder的子节点
    annotation.appendChild(folder)  # folder作为annotation的子节点

    filename = doc.createElement('filename')
    filename.appendChild(doc.createTextNode(filename_content))
    annotation.appendChild(filename)

    filename = doc.createElement('path')
    filename.appendChild(doc.createTextNode(jpg_path))
    annotation.appendChild(filename)

    source = doc.createElement('source')
    database = doc.createElement('database')
    database.appendChild(doc.createTextNode("Unknown"))
    source.appendChild(database)

    annotation.appendChild(source)

    size = doc.createElement('size')
    width = doc.createElement('width')
    width.appendChild(doc.createTextNode("%d" % w))
    size.appendChild(width)
    height = doc.createElement('height')
    height.appendChild(doc.createTextNode("%d" % h))
    size.appendChild(height)
    depth = doc.createElement('depth')
    depth.appendChild(doc.createTextNode("%d" % d))
    size.appendChild(depth)
    annotation.appendChild(size)

    segmented = doc.createElement('segmented')
    segmented.appendChild(doc.createTextNode("0"))
    annotation.appendChild(segmented)

    object = doc.createElement('object')
    nm = doc.createElement('name')
    nm.appendChild(doc.createTextNode('fashion'))
    object.appendChild(nm)
    pose = doc.createElement('pose')
    pose.appendChild(doc.createTextNode("Unspecified"))
    object.appendChild(pose)

    difficult = doc.createElement('difficult')
    difficult.appendChild(doc.createTextNode("0"))
    object.appendChild(difficult)
    bndbox = doc.createElement('bndbox')
    xmin = doc.createElement('xmin')
    xmin.appendChild(doc.createTextNode('6'))
    bndbox.appendChild(xmin)
    ymin = doc.createElement('ymin')
    ymin.appendChild(doc.createTextNode('6'))
    bndbox.appendChild(ymin)
    xmax = doc.createElement('xmax')
    xmax.appendChild(doc.createTextNode('6'))
    bndbox.appendChild(xmax)
    ymax = doc.createElement('ymax')
    ymax.appendChild(doc.createTextNode('6'))
    bndbox.appendChild(ymax)
    object.appendChild(bndbox)
    annotation.appendChild(object)
    savefile = open(os.path.join(xml_dir, filename_content+'.xml'), 'w')
    savefile.write(doc.toprettyxml())
    savefile.close()


if __name__ == '__main__':
    # lines = open(r'/Users/cpz/Downloads/Fashion Landmark Detection Benchmark/Anno/list_bbox.txt', 'r').readlines()[2:]
    # cnt = 0
    # for line in lines:
    #     create_xml(line)
    #     cnt += 1
    #     if cnt % 100 == 0:
    #         print(cnt)
    gen_i_fashion_train()
