"""给 Markdown 文档生成目录（锚点按 GitHub 的规则算）。

用法：

    python tools/gen_toc.py <file.md>            # 只打印目录
    python tools/gen_toc.py <file.md> --write    # 写回文件里 <!-- toc --> 与 <!-- /toc --> 之间

标题层级映射到缩进：二级标题顶格，三级标题缩进一层；一级标题（文档标题）不进目录。
锚点规则跟 GitHub 一致：转小写、去掉标点、空格换连字符，中文原样保留；
同名标题依次加 -1、-2 后缀。
"""

import argparse
import re
from pathlib import Path

HEADING = re.compile(r"^(#{1,6})\s+(.*?)\s*$")
TOC_START = "<!-- toc -->"
TOC_END = "<!-- /toc -->"
INDENT = "    "


def slug(text: str) -> str:
    """把标题转成 GitHub 风格的锚点。"""
    text = re.sub(r"`([^`]*)`", r"\1", text)  # 行内代码去掉反引号
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)  # 链接只留文字
    text = text.lower()
    text = "".join(ch for ch in text if ch.isalnum() or ch in " -_")
    return text.strip().replace(" ", "-")


def build_toc(lines: list[str], max_level: int) -> list[str]:
    """按出现顺序收集标题，返回目录的 Markdown 行。"""
    entries: list[tuple[int, str, str]] = []
    seen: dict[str, int] = {}
    for line in lines:
        match = HEADING.match(line)
        if not match:
            continue
        level = len(match.group(1))
        if level < 2 or level > max_level:
            continue
        title = match.group(2)
        base = slug(title)
        count = seen.get(base, 0)
        seen[base] = count + 1
        anchor = base if count == 0 else f"{base}-{count}"
        entries.append((level, title, anchor))

    toc = []
    for level, title, anchor in entries:
        toc.append(f"{INDENT * (level - 2)}- [{title}](#{anchor})")
    return toc


def main() -> int:
    parser = argparse.ArgumentParser(description="生成 Markdown 目录")
    parser.add_argument("path", type=Path, help="要处理的 Markdown 文件")
    parser.add_argument("--write", action="store_true", help="写回文件（默认只打印）")
    parser.add_argument("--max-level", type=int, default=3, help="收集到第几级标题，默认 3")
    args = parser.parse_args()

    text = args.path.read_text(encoding="utf-8")
    lines = text.splitlines()
    toc = build_toc(lines, args.max_level)

    if not args.write:
        print("\n".join(toc))
        return 0

    if TOC_START not in text or TOC_END not in text:
        print(f"没找到 {TOC_START} / {TOC_END} 标记，先手动加上再跑")
        return 1

    before, rest = text.split(TOC_START, 1)
    _, after = rest.split(TOC_END, 1)
    new_text = f"{before}{TOC_START}\n" + "\n".join(toc) + f"\n{TOC_END}{after}"
    args.path.write_text(new_text, encoding="utf-8")
    print(f"已写入 {len(toc)} 条目录：{args.path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
