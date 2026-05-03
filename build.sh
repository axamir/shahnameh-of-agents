#!/bin/bash
# build.sh — Generate PDF and EPUB versions of the Shahnameh of Agents
# Usage: bash build.sh [fa|en]

LANG=${1:-fa}
OUTPUT_DIR="build"
mkdir -p "$OUTPUT_DIR"

# Collect all md files in the specified language directory, sorted by number
FILES=$(ls -1 ${LANG}/*.md | sort -t'/' -k2 -n)

echo "Combining ${LANG} files into ${LANG}/_combined.md..."
cat $FILES > "${LANG}/_combined.md"

echo "Generating PDF..."
pandoc "${LANG}/_combined.md" \
    --pdf-engine=xelatex \
    -V mainfont="DejaVu Sans" \
    -V geometry:margin=1in \
    -o "${OUTPUT_DIR}/Shahnameh_of_Agents_${LANG}.pdf"

echo "Generating EPUB..."
pandoc "${LANG}/_combined.md" \
    -o "${OUTPUT_DIR}/Shahnameh_of_Agents_${LANG}.epub"

echo "Done! Output files are in the '${OUTPUT_DIR}' directory."
