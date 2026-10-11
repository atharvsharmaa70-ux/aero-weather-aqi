Add-Type -AssemblyName System.Speech

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice("Microsoft Zira Desktop")
$synth.Rate = 0  # Normal pacing

$outputWav = Join-Path $PSScriptRoot "..\public\demo_voiceover.wav"
$synth.SetOutputToWaveFile($outputWav)

$scriptText = @"
Welcome to AeroWeather, a smart air quality and weather sentinel deployed on AWS Amplify.
First, our dynamic theme adapts to weather and daylight. In day mode, the interface displays a luminous light blue sky gradient.
Switching to night mode transitions into a deep midnight dark blue palette.
Next, our live telemetry pulls real-time atmospheric data via the free Open-Meteo API with zero API keys.
Selecting Home loads New Delhi, which immediately activates our seasonal crop burning and stubble smoke alert for October and November.
Selecting School switches to San Francisco with clean coastal air.
Our health sensitivity setting lets users personalize thresholds. In asthma mode, mask and indoor exercise alerts trigger earlier for respiratory safety.
Below, our predictive forecast analyzes the next 24 hours to find the optimal clean air window to go outside versus peak pollution hours.
Our simulated connected air purifier features real-time indoor telemetry. When turned on, the simulated indoor PM 2.5 drops down to clean HEPA levels.
Finally, in-app notification cards alert users to sudden spikes.
The entire application is production ready and hosted live on AWS Amplify Hosting.
"@

$synth.Speak($scriptText)
$synth.Dispose()

Write-Host "Voiceover audio saved successfully to: $outputWav"
