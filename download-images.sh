#!/bin/bash

# MuseumHubs Image Download Script
# This script downloads high-quality images for the museum website

cd public/images

echo "Downloading museum and cultural heritage images..."

# Museum interior and exhibits
curl -o museum-hero.jpg "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop" -L
curl -o museum-gallery.jpg "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" -L
curl -o museum-artifacts.jpg "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" -L

# Cultural heritage and traditional art
curl -o african-art.jpg "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" -L
curl -o cultural-exhibit.jpg "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" -L
curl -o heritage-site.jpg "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" -L

# Country-specific images
curl -o south-africa-heritage.jpg "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" -L
curl -o egypt-pyramids.jpg "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" -L
curl -o nigeria-culture.jpg "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" -L
curl -o cameroon-tradition.jpg "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" -L

# Museum collections and displays
curl -o ancient-artifacts.jpg "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" -L
curl -o traditional-crafts.jpg "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" -L
curl -o historical-display.jpg "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" -L

echo "Image download complete!"
echo "Note: Some images may be the same due to API limitations. Consider manually replacing with diverse images." 