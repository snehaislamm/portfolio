"""Draw Sneha's pixel-art sprite sheet (32x48 frames) with only the standard library.

Writes sneha-sprite.png (native, 10 frames in a row) and sneha-sprite-preview.png (x8, on a
checkerboard, with frame labels as gaps) next to this script.
"""
import struct
import sys
import zlib
from pathlib import Path

W, H = 32, 48
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent

# Palette (DESIGN.md tokens where possible), <=16 colours incl. transparent.
PAL = {
    "K": (0x00, 0x00, 0x00),  # outline (edge)
    "H": (0x2A, 0x1A, 0x0F),  # hair dark / pupils
    "h": (0x4E, 0x33, 0x1C),  # hair light (highlight strands)
    "S": (0xD9, 0xA0, 0x74),  # skin
    "s": (0xB3, 0x77, 0x4E),  # skin shade / smile
    "T": (0x2B, 0x2A, 0x25),  # black top (panel)
    "C": (0xE6, 0xEE, 0xF2),  # lab coat (snow)
    "c": (0xB5, 0xB5, 0xAE),  # coat shade (stone-light)
    "Y": (0xF2, 0xC9, 0x4C),  # skirt (gold)
    "y": (0xB8, 0x92, 0x2A),  # skirt shade (gold-dark)
    "L": (0x8A, 0x8A, 0x84),  # laptop / probe (stone)
    "l": (0x5F, 0x5F, 0x5A),  # glasses wire / chip (stone-dark)
    "B": (0x1A, 0x1A, 0x17),  # shoes (coal)
    "W": (0xFF, 0xF3, 0xB0),  # sparkle (gold-light)
    "P": (0x6F, 0xC0, 0xE8),  # screen glow / probe tip (sky)
}

HEAD = [
    "................................",
    "...........HHHHHHHH.............",
    ".........HHHhhhhhhHHH...........",
    "........HHhhHHHHHHhhHH..........",
    ".......HHhHHHHHHHHHHHhHH........",
    "......HHhHHHHHHHHHHHHHhHH.......",
    "......HhHHHHHHHHHHHHHHHHH.......",
    "......HhHHHHSSHHHSSSSHHHH.......",
    "......HhHHSlllSSSlllSSSHH.......",
    "......HhHHlSHSlllSHSlSSHH.......",
    "......HhHHlSHSlSlSHSlSSHH.......",
    "......HhHHlSSSlSlSSSlSSSH.......",
    "......HhHHSlllSSSlllSSSSH.......",
    "......HhHHSSSSSSSSSSSSSH........",
    "......HhHHHSSSSSssSSSSHH........",
    "......HhhHHHSSSSSSSSSHHH........",
    "......HHhHHHHsSSSSSHHHH.........",
    "......HHhHHHHHsSSsHHHHH.........",
]
for row in HEAD:
    assert len(row) == W, (len(row), row)


class Frame:
    def __init__(self) -> None:
        self.px: dict[tuple[int, int], str] = {}

    def put(self, x: int, y: int, c: str) -> None:
        if 0 <= x < W and 0 <= y < H:
            self.px[(x, y)] = c

    def rect(self, x0: int, y0: int, x1: int, y1: int, c: str) -> None:
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.put(x, y, c)

    def art(self, rows: list[str], dx: int = 0, dy: int = 0) -> None:
        for y, row in enumerate(rows):
            for x, ch in enumerate(row):
                if ch != ".":
                    self.put(x + dx, y + dy, ch)

    def outline(self) -> None:
        add = []
        for y in range(H):
            for x in range(W):
                if (x, y) in self.px:
                    continue
                if any((x + ox, y + oy) in self.px for ox, oy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    add.append((x, y))
        for p in add:
            self.px[p] = "K"


def body(f: Frame, bob: int = 0, hem: int = 0) -> None:
    """Hair behind, torso with open lab coat, long skirt. `hem` sways the skirt (-1/0/1)."""
    b = bob
    # long wavy hair falling behind the shoulders
    f.rect(6, 17 + b, 10, 27 + b, "H")
    for y in range(18 + b, 28 + b, 3):
        f.put(7, y, "h")
        f.put(9, y + 1, "h")
    f.put(6, 28 + b, "H"); f.put(8, 28 + b, "H"); f.put(10, 28 + b, "H")
    f.rect(21, 17 + b, 23, 22 + b, "H"); f.put(22, 19 + b, "h"); f.put(23, 23 + b, "H")
    # neck
    f.rect(14, 17 + b, 17, 18 + b, "s")
    # lab coat torso (open front shows the black top)
    f.rect(10, 19 + b, 21, 33 + b, "C")
    f.rect(13, 19 + b, 18, 27 + b, "T")
    f.rect(13, 28 + b, 18, 33 + b, "Y")  # skirt shows through the open coat
    for y in range(19 + b, 34 + b):
        f.put(12, y, "c"); f.put(19, y, "c")
    f.put(10, 33 + b, "c"); f.put(21, 33 + b, "c")
    # UWaterloo colours badge on the viewer's left: gold / black stripe / gold (not the real crest)
    f.rect(10, 21 + b, 11, 21 + b, "Y"); f.rect(10, 22 + b, 11, 22 + b, "K")
    f.rect(10, 23 + b, 11, 23 + b, "Y"); f.rect(10, 24 + b, 11, 24 + b, "y")
    # patch pocket on the viewer's right, low on the coat
    f.rect(20, 29 + b, 21, 29 + b, "c"); f.rect(20, 32 + b, 21, 32 + b, "c")
    f.put(21, 30 + b, "c"); f.put(21, 31 + b, "c")
    # skirt below the coat: long, pale gold, slight flare
    for i, y in enumerate(range(34 + b, 45)):
        flare = 1 if i >= 5 else 0
        f.rect(11 - flare + (hem if i >= 7 else 0), y, 20 + flare + (hem if i >= 7 else 0), y, "Y")
        f.put(15 + (hem if i >= 7 else 0), y, "y")
    f.rect(10 + hem, 44, 21 + hem, 44, "y")


def head(f: Frame, bob: int = 0, look_up: bool = False) -> None:
    f.art(HEAD, 0, bob)
    if look_up:  # eyebrows raised: curious look at the chip
        f.put(12, 7 + bob, "H"); f.put(18, 7 + bob, "H")


def shoes(f: Frame, back: int, front: int) -> None:
    f.rect(back, 45, back + 3, 46, "B")
    f.rect(front, 45, front + 3, 46, "B")


def left_arm_down(f: Frame, b: int = 0) -> None:
    f.rect(8, 21 + b, 9, 30 + b, "C"); f.put(8, 30 + b, "c")
    f.rect(8, 31 + b, 9, 32 + b, "S")


def right_arm_down(f: Frame, b: int = 0) -> None:
    f.rect(22, 20 + b, 23, 30 + b, "C"); f.put(23, 30 + b, "c")
    f.rect(22, 31 + b, 23, 32 + b, "S")


def sparkle(f: Frame, x: int, y: int, big: bool = True) -> None:
    f.put(x, y, "W")
    if big:
        for ox, oy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            f.put(x + ox, y + oy, "W")


def idle(n: int) -> Frame:
    f = Frame()
    b = n  # frame 2 breathes down 1 px
    body(f, b); left_arm_down(f, b); right_arm_down(f, b)
    # probe in the right hand, pointing down, gold tip
    f.rect(23, 33 + b, 23, 38 + b, "L"); f.put(23, 39 + b, "Y")
    head(f, b); shoes(f, 11, 17)
    f.outline()
    return f


def walk(n: int) -> Frame:
    # contact, down, pass, up
    bob = (0, 1, 0, -1)[n]
    hem = (1, 0, -1, 0)[n]
    feet = ((8, 20), (10, 18), (12, 15), (10, 18))[n]
    f = Frame()
    body(f, bob, hem)
    left_arm_down(f, bob)
    # right arm bent, laptop tucked under it
    f.rect(22, 20 + bob, 23, 26 + bob, "C")
    f.rect(19, 26 + bob, 26, 28 + bob, "L"); f.rect(19, 28 + bob, 26, 28 + bob, "l")
    f.put(25, 27 + bob, "P")
    f.rect(21, 25 + bob, 22, 25 + bob, "S")
    head(f, bob); shoes(f, *feet)
    f.outline()
    return f


def thinking(n: int) -> Frame:
    f = Frame()
    body(f); left_arm_down(f)
    # right forearm up, chip held in front of the face
    f.rect(22, 20, 23, 25, "C")
    f.rect(24, 15, 25, 21, "C"); f.put(25, 21, "c")
    f.rect(24, 13, 25, 14, "S")
    f.rect(24, 10, 26, 12, "l")
    for x in (24, 26):
        f.put(x, 9, "Y"); f.put(x, 13 - 0, "S" if x == 24 else "Y")
    head(f, look_up=True); shoes(f, 11, 17)
    f.outline()
    if n == 1:
        sparkle(f, 28, 8)
    else:
        f.put(27, 9, "W")
    return f


def celebrate(n: int) -> Frame:
    b = -n  # hop
    f = Frame()
    body(f, b)
    head(f, b)
    # both arms up and out, drawn over the hair so the hands show
    for i in range(10):
        y = 20 + b - i
        f.rect(8 - i // 2, y, 9 - i // 2, y, "C")
        f.rect(22 + i // 2, y, 23 + i // 2, y, "C")
    f.rect(3, 8 + b, 4, 10 + b, "S")
    f.rect(27, 8 + b, 28, 10 + b, "S")
    shoes(f, 11, 17) if n == 0 else shoes(f, 10, 18)
    f.outline()
    spots = ((3, 5), (28, 4), (27, 13), (3, 15)) if n == 0 else ((4, 3), (28, 9), (2, 11), (26, 2))
    for i, (x, y) in enumerate(spots):
        sparkle(f, x, y, big=(i % 2 == 0))
    return f


FRAMES = [idle(0), idle(1), *(walk(i) for i in range(4)), thinking(0), thinking(1), celebrate(0), celebrate(1)]


def png(path: Path, width: int, height: int, pixel) -> None:
    raw = bytearray()
    for y in range(height):
        raw.append(0)
        for x in range(width):
            raw.extend(pixel(x, y))

    def chunk(kind: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)

    data = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
    data += chunk(b"IDAT", zlib.compress(bytes(raw), 9)) + chunk(b"IEND", b"")
    path.write_bytes(data)


def native(x: int, y: int) -> tuple[int, int, int, int]:
    c = FRAMES[x // W].px.get((x % W, y))
    return (*PAL[c], 255) if c else (0, 0, 0, 0)


SCALE, GAP = 8, 16


def preview(x: int, y: int) -> tuple[int, int, int, int]:
    cell = W * SCALE + GAP
    fx, rx = divmod(x, cell)
    if rx >= W * SCALE:
        return (0x1A, 0x1A, 0x17, 255)
    c = FRAMES[fx].px.get((rx // SCALE, y // SCALE))
    if c:
        return (*PAL[c], 255)
    checker = ((rx // SCALE) + (y // SCALE)) % 2
    return (0x2B, 0x2A, 0x25, 255) if checker else (0x22, 0x22, 0x20, 255)


OUT.mkdir(parents=True, exist_ok=True)
png(OUT / "sneha-sprite.png", W * len(FRAMES), H, native)
png(OUT / "sneha-sprite-preview.png", (W * SCALE + GAP) * len(FRAMES), H * SCALE, preview)
used = {c for fr in FRAMES for c in fr.px.values()}
print(f"{len(FRAMES)} frames, {len(used)} colours (+transparent), "
      f"{(OUT / 'sneha-sprite.png').stat().st_size} bytes")
