#!/bin/bash

# Directory containing PNG files
DIR="."

# Quality setting for JPEG compression (0-100)
# Lower numbers mean higher compression and lower quality
QUALITY=75

# Loop through each PNG file in the directory
# Loop through each file in the directory
for file in "$DIR"/*; do
    # Skip if directory is empty
    [ -e "$file" ] || continue

    # Skip if the file is already a .webp file
    if [[ $file == *.webp ]]; then
        continue
    fi

    # Define the output file name (change extension to .webp)
    output="${file%.*}.webp"

    # Convert the file to WEBP format
    convert "$file" "$output"

    # Optional: Uncomment the following line to remove the original file
    # rm "$file"
done

echo "Conversion complete."

