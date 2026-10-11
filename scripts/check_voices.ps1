Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

$voices = $synth.GetInstalledVoices()
foreach ($v in $voices) {
    Write-Host "Voice: " $v.VoiceInfo.Name
}
