# Structural checks only. This script cannot approve survival content.
$ErrorActionPreference = 'Stop'
$taskCheckRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$taskFailures = [System.Collections.Generic.List[string]]::new()

Push-Location -LiteralPath $taskCheckRoot
try {
    $taskMarkdownPaths = @(& rg --files -g '*.md' -g '!output/**' -g '!reader/**' -g '!.git/**')
    if ($LASTEXITCODE -ne 0 -or $taskMarkdownPaths.Count -eq 0) {
        throw 'Could not enumerate project Markdown files.'
    }
} finally {
    Pop-Location
}

$taskSourceText = Get-Content -LiteralPath (Join-Path $taskCheckRoot 'SOURCE_REGISTER.md') -Raw
$taskSourceDefinitions = @([regex]::Matches($taskSourceText, '(?m)^\|\s*(S-\d{3})\s*\|') | ForEach-Object { $_.Groups[1].Value })
$taskSourceSet = [System.Collections.Generic.HashSet[string]]::new()
foreach ($taskSourceId in $taskSourceDefinitions) {
    if (-not $taskSourceSet.Add($taskSourceId)) {
        $taskFailures.Add("Duplicate source definition: $taskSourceId")
    }
}

$taskReferences = [System.Collections.Generic.HashSet[string]]::new()
$taskLinkCount = 0
foreach ($taskRelativePath in $taskMarkdownPaths) {
    $taskAbsolutePath = Join-Path $taskCheckRoot $taskRelativePath
    $taskDocument = Get-Content -LiteralPath $taskAbsolutePath -Raw
    foreach ($taskMatch in [regex]::Matches($taskDocument, '\bS-\d{3}\b')) {
        [void]$taskReferences.Add($taskMatch.Value)
    }
    foreach ($taskRange in [regex]::Matches($taskDocument, '\bS-(\d{3})\s*(?:[-–—]|to)\s*S-(\d{3})\b')) {
        $taskStart = [int]$taskRange.Groups[1].Value
        $taskEnd = [int]$taskRange.Groups[2].Value
        if ($taskEnd -lt $taskStart) {
            $taskFailures.Add("Reversed source range in ${taskRelativePath}: $($taskRange.Value)")
        } else {
            for ($taskSourceNumber = $taskStart; $taskSourceNumber -le $taskEnd; $taskSourceNumber++) {
                [void]$taskReferences.Add(('S-{0:D3}' -f $taskSourceNumber))
            }
        }
    }

    # File existence for inline document/image links; anchors and remote URLs are not tested.
    foreach ($taskLink in [regex]::Matches($taskDocument, '\[[^\]\r\n]*\]\(([^)\r\n]+)\)')) {
        $taskTarget = $taskLink.Groups[1].Value.Trim().Trim('<', '>')
        if ($taskTarget -match '^(?:[a-zA-Z][a-zA-Z0-9+.-]*:|#)' -or $taskTarget -notmatch '\.(?:md|svg|png|jpe?g|webp)(?:#.*)?$') { continue }
        $taskTarget = [Uri]::UnescapeDataString(($taskTarget -split '#', 2)[0])
        $taskResolvedTarget = [System.IO.Path]::GetFullPath((Join-Path (Split-Path -Parent $taskAbsolutePath) $taskTarget))
        $taskLinkCount++
        if (-not (Test-Path -LiteralPath $taskResolvedTarget -PathType Leaf)) {
            $taskFailures.Add("Missing linked file in ${taskRelativePath}: $taskTarget")
        }
    }
}

foreach ($taskSourceId in $taskReferences) {
    if (-not $taskSourceSet.Contains($taskSourceId)) { $taskFailures.Add("Missing source definition: $taskSourceId") }
}

$taskManifest = Get-Content -LiteralPath (Join-Path $taskCheckRoot 'book/MANIFEST.md') -Raw
$taskChapters = @([regex]::Matches($taskManifest, '`(chapters/[^`]+\.md)`') | ForEach-Object { $_.Groups[1].Value })
if ($taskChapters.Count -ne 15) { $taskFailures.Add('Review the changed chapter count; this check expects the current 15-chapter architecture.') }
if (@($taskChapters | Select-Object -Unique).Count -ne $taskChapters.Count) { $taskFailures.Add('Duplicate manifest chapter.') }
foreach ($taskChapter in $taskChapters) {
    if (-not (Test-Path -LiteralPath (Join-Path (Join-Path $taskCheckRoot 'book') $taskChapter) -PathType Leaf)) {
        $taskFailures.Add("Missing manifest chapter: $taskChapter")
    }
}
if ($taskManifest -match 'EMERGENCY_CORE_REVIEW_PROTOTYPE') { $taskFailures.Add('Review prototype must not be in the book manifest.') }

# A small regression guard against reverting to nearly empty chapter scaffolds.
# Word counts include headings and notes; they do not prove useful or safe prose.
$taskChapterWordCount = 0
$taskChapterWarningCount = 0
foreach ($taskChapter in $taskChapters) {
    $taskChapterFile = Join-Path (Join-Path $taskCheckRoot 'book') $taskChapter
    if (-not (Test-Path -LiteralPath $taskChapterFile -PathType Leaf)) { continue }
    $taskChapterText = Get-Content -LiteralPath $taskChapterFile -Raw
    $taskWords = [regex]::Matches($taskChapterText, '\S+').Count
    $taskChapterWordCount += $taskWords
    $taskChapterWarningCount += [regex]::Matches($taskChapterText, '(?m)^> \*\*WARNING').Count
    if ($taskWords -lt 200) { $taskFailures.Add("Chapter may have reverted to an outline: $taskChapter") }
    if ($taskChapter -match '^chapters/(?:0[2-9]|1[0-3])-' -and $taskChapterText -notmatch '(?m)^> \*\*WARNING') {
        $taskFailures.Add("Missing working-draft warning in practical chapter: $taskChapter")
    }
}

$taskPrototype = Get-Content -LiteralPath (Join-Path $taskCheckRoot 'research/review-drafts/EMERGENCY_CORE_REVIEW_PROTOTYPE_v0.1.md') -Raw
$taskPrototypeSections = @([regex]::Matches($taskPrototype, '(?m)^## System \d+')).Count
$taskPrototypeWarnings = @([regex]::Matches($taskPrototype, '(?m)^> \*\*REVIEW COPY — NOT EMERGENCY GUIDANCE\*\*')).Count
if ($taskPrototypeSections -ne 10 -or $taskPrototypeWarnings -ne $taskPrototypeSections) {
    $taskFailures.Add('Review the prototype section/warning counts; each of the current ten systems needs its warning.')
}

$taskEdition = Get-Content -LiteralPath (Join-Path $taskCheckRoot 'book/EDITION_STATUS.md') -Raw
if ($taskEdition -notmatch 'FIELD_READY_BUILD=NO' -or $taskEdition -match 'FIELD_READY_BUILD=YES') {
    $taskFailures.Add('Current working-edition audit expects field-ready approval to remain NO; investigate before release.')
}
$taskWorkingPath = Join-Path $taskCheckRoot 'output/markdown/VICTORIAN_BUSH_SURVIVAL_FIELD_GUIDE_WORKING.md'
$taskOutputLinkCount = 0
if (-not (Test-Path -LiteralPath $taskWorkingPath)) {
    $taskFailures.Add('Working Markdown has not been built.')
} else {
    $taskWorkingText = Get-Content -LiteralPath $taskWorkingPath -Raw
    if (-not $taskWorkingText.StartsWith('# WORKING EDITION - NOT FOR FIELD USE')) {
        $taskFailures.Add('Working Markdown is missing its opening warning.')
    }
    foreach ($taskLink in [regex]::Matches($taskWorkingText, '\[[^\]\r\n]*\]\(([^)\r\n]+)\)')) {
        $taskTarget = $taskLink.Groups[1].Value.Trim().Trim('<', '>')
        if ($taskTarget -match '^(?:[a-zA-Z][a-zA-Z0-9+.-]*:|#)' -or $taskTarget -notmatch '\.(?:md|svg|png|jpe?g|webp)(?:#.*)?$') { continue }
        $taskTarget = [Uri]::UnescapeDataString(($taskTarget -split '#', 2)[0])
        $taskOutputLinkCount++
        if (-not (Test-Path -LiteralPath (Join-Path (Split-Path -Parent $taskWorkingPath) $taskTarget) -PathType Leaf)) {
            $taskFailures.Add("Missing file linked from assembled output: $taskTarget")
        }
    }
}

if ($taskFailures.Count -gt 0) {
    throw ($taskFailures -join [Environment]::NewLine)
}

[ordered]@{
    Result = 'PASS - file structure only; not safety approval'
    MarkdownFiles = $taskMarkdownPaths.Count
    SourceDefinitions = $taskSourceDefinitions.Count
    UniqueReferencedSourceIds = $taskReferences.Count
    LocalDocumentAndImageLinksChecked = $taskLinkCount
    ManifestChapters = $taskChapters.Count
    ChapterWordsIncludingNotes = $taskChapterWordCount
    ChapterWarningBoxes = $taskChapterWarningCount
    AssembledDocumentAndImageLinksChecked = $taskOutputLinkCount
    PrototypeSystems = $taskPrototypeSections
    PrototypeSectionWarnings = $taskPrototypeWarnings
    FieldReadyApproval = 'NO'
    WorkingBytes = (Get-Item -LiteralPath $taskWorkingPath).Length
    WorkingSHA256 = (Get-FileHash -LiteralPath $taskWorkingPath -Algorithm SHA256).Hash
    NotTested = 'Remote URL availability; link anchors; factual accuracy; source independence; rights; human comprehension; physical performance; specialist approval; PDF layout'
} | ConvertTo-Json
