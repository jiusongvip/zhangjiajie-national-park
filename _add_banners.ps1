$pagesDir = "d:\workspaces\website\zhangjiajie-national-park\src\pages"

$banners = @{
    "guide.astro"                = @{file="banner-guide"; alt="Panoramic sandstone pillars of Zhangjiajie National Forest Park"}
    "attractions.astro"          = @{file="banner-attractions"; alt="Green valley surrounded by majestic Zhangjiajie mountains"}
    "tianmen-mountain.astro"     = @{file="banner-tianmen"; alt="Tianmen Mountain with Heavens Gate natural stone arch"}
    "avatar-mountains.astro"     = @{file="banner-avatar"; alt="Avatar Hallelujah Mountain sandstone pillar rising above forest"}
    "glass-bridge.astro"         = @{file="banner-glassbridge"; alt="Zhangjiajie Glass Bridge suspended above Grand Canyon"}
    "hiking-trails.astro"        = @{file="banner-hiking"; alt="Sandstone rock formations in Zhangjiajie National Park forest"}
    "weather.astro"              = @{file="banner-weather"; alt="Misty clouds wrapping around Zhangjiajie mountain peaks"}
    "best-time-to-visit.astro"   = @{file="banner-besttime"; alt="Lush green rocky mountain landscape in Zhangjiajie"}
    "tickets.astro"              = @{file="banner-tickets"; alt="Aerial view of Zhangjiajie National Park entrance area"}
    "how-to-get-there.astro"     = @{file="banner-transport"; alt="Cable car gliding over Zhangjiajie mountain range"}
    "hotels.astro"               = @{file="banner-hotels"; alt="Tianmen Mountain scenery near Wulingyuan accommodation"}
    "itinerary.astro"            = @{file="banner-itinerary"; alt="Aerial panorama of Zhangjiajie for trip planning"}
    "photography.astro"          = @{file="banner-photography"; alt="Misty Zhangjiajie peaks perfect for landscape photography"}
    "faq.astro"                  = @{file="banner-faq"; alt="Zhangjiajie sandstone pillars above lush green forest"}
    "food.astro"                 = @{file="banner-food"; alt="Traditional Chinese hot pot cuisine with fresh ingredients"}
    "compare.astro"              = @{file="banner-compare"; alt="Dramatic Zhangjiajie landscape for destination comparison"}
    "fenghuang-ancient-town.astro" = @{file="banner-fenghuang"; alt="Fenghuang Ancient Town riverside at night"}
    "about.astro"                = @{file="banner-about"; alt="Cable cars traveling through Zhangjiajie mountain scenery"}
}

foreach ($filename in $banners.Keys) {
    $filepath = Join-Path $pagesDir $filename
    if (-not (Test-Path $filepath)) {
        Write-Host "SKIP: $filename"
        continue
    }
    
    $info = $banners[$filename]
    $content = Get-Content $filepath -Raw

    $bannerHTML = @"

  <div class="mt-8 rounded-2xl overflow-hidden">
    <picture>
      <source srcset="/$($info.file).webp" type="image/webp" />
      <img
        src="/$($info.file).jpg"
        alt="$($info.alt)"
        class="w-full aspect-[21/9] object-cover"
        width="1200"
        height="514"
        loading="eager"
        decoding="async"
      />
    </picture>
  </div>
"@

    # Find the point after </nav> and before <div class="mt-12 or mt-16
    $navIndex = $content.IndexOf('</nav>')
    if ($navIndex -eq -1) {
        Write-Host "NO NAV: $filename"
        continue
    }
    
    $afterNav = $content.Substring($navIndex + 6)
    $match = [regex]::Match($afterNav, '<div class="mt-1[26]')
    if (-not $match.Success) {
        Write-Host "NO DIV: $filename"
        continue
    }
    
    $insertIndex = $navIndex + 6 + $match.Index
    $newContent = $content.Substring(0, $insertIndex) + "`n" + $bannerHTML + "`n    " + $content.Substring($insertIndex)
    Set-Content $filepath $newContent -NoNewline
    Write-Host "OK: $filename"
}

Write-Host "Done! All banners inserted."
