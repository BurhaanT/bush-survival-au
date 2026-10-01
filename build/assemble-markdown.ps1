param(
    [switch]$FieldReady
)

$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$manifestPath = Join-Path $projectRoot 'book\MANIFEST.md'
$statusPath = Join-Path $projectRoot 'book\EDITION_STATUS.md'
$chapterRoot = Join-Path $projectRoot 'book'
$outputRoot = Join-Path $projectRoot 'output\markdown'

$manifestText = Get-Content -LiteralPath $manifestPath -Raw
$chapterMatches = [regex]::Matches($manifestText, '`(chapters/[^`]+\.md)`')

if ($chapterMatches.Count -eq 0) {
    throw 'No chapter files were found in the build manifest.'
}

$statusText = Get-Content -LiteralPath $statusPath -Raw
if ($FieldReady -and -not $statusText.Contains('FIELD_READY_BUILD=YES')) {
    throw 'Field-ready assembly is blocked: the edition approval flag is not YES.'
}

$parts = [System.Collections.Generic.List[string]]::new()

if (-not $FieldReady) {
    $parts.Add("# WORKING EDITION - NOT FOR FIELD USE`r`n`r`nThis is a readable working manuscript with practical instructions and explicit limitations. Independent specialist review, reader testing and factual image validation are incomplete. It is not an approved emergency manual. Read the warning before each high-consequence section.`r`n`r`n---")
}

foreach ($match in $chapterMatches) {
    $relativePath = $match.Groups[1].Value.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
    $chapterPath = Join-Path $chapterRoot $relativePath
    if (-not (Test-Path -LiteralPath $chapterPath)) {
        throw "Manifest chapter is missing: $chapterPath"
    }

    $chapterText = (Get-Content -LiteralPath $chapterPath -Raw).Trim()
    # Keep file links valid from the generated output directory. Chapter sources
    # stay untouched; PDF anchor conversion remains a later layout step.
    $chapterDirectory = Split-Path -Parent $chapterPath
    $chapterText = [regex]::Replace($chapterText, '(\[[^\]\r\n]*\]\()([^\)\r\n]+)(\))', [System.Text.RegularExpressions.MatchEvaluator]{
        param($linkMatch)
        $target = $linkMatch.Groups[2].Value.Trim().Trim('<', '>')
        if ($target -match '^(?:[a-zA-Z][a-zA-Z0-9+.-]*:|#|/)' -or $target -notmatch '\.(?:md|svg|png|jpe?g|webp)(?:#.*)?$') {
            return $linkMatch.Value
        }
        $targetParts = $target -split '#', 2
        $absoluteTarget = [System.IO.Path]::GetFullPath((Join-Path $chapterDirectory ([Uri]::UnescapeDataString($targetParts[0]))))
        if (-not (Test-Path -LiteralPath $absoluteTarget -PathType Leaf)) {
            throw "Missing chapter link in ${chapterPath}: $target"
        }
        $relativeTarget = [System.IO.Path]::GetRelativePath($outputRoot, $absoluteTarget).Replace('\', '/')
        if ($targetParts.Count -gt 1) { $relativeTarget += '#' + $targetParts[1] }
        return $linkMatch.Groups[1].Value + '<' + $relativeTarget + '>' + $linkMatch.Groups[3].Value
    })
    $parts.Add($chapterText)
}

$outputName = if ($FieldReady) {
    'VICTORIAN_BUSH_SURVIVAL_FIELD_GUIDE.md'
} else {
    'VICTORIAN_BUSH_SURVIVAL_FIELD_GUIDE_WORKING.md'
}

$outputPath = Join-Path $outputRoot $outputName
$separator = "`r`n`r`n<div class=`"page-break`"></div>`r`n`r`n"
$assembled = ($parts -join $separator) + "`r`n"
[System.IO.File]::WriteAllText($outputPath, $assembled, [System.Text.UTF8Encoding]::new($false))

$chapterCount = $chapterMatches.Count
$bytes = (Get-Item -LiteralPath $outputPath).Length
Write-Output "Assembled $chapterCount chapters into $outputPath ($bytes bytes)."
