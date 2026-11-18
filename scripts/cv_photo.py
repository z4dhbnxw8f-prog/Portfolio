from reportlab.lib.utils import ImageReader
from reportlab.platypus import Flowable


class Portrait(Flowable):
    """Place the supplied portrait without stretching or modifying the image."""

    def __init__(self, filename, width, height):
        super().__init__()
        self.image = ImageReader(str(filename))
        self.width, self.height = width, height
        self.hAlign = "RIGHT"

    def draw(self):
        source_width, source_height = self.image.getSize()
        scale = max(self.width / source_width, self.height / source_height)
        width, height = source_width * scale, source_height * scale
        self.canv.saveState()
        clip = self.canv.beginPath()
        clip.rect(0, 0, self.width, self.height)
        self.canv.clipPath(clip, stroke=0)
        self.canv.drawImage(self.image, (self.width - width) / 2,
                            (self.height - height) * .2, width, height, mask="auto")
        self.canv.restoreState()
