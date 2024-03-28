function calculatePoints() {
    var n = parseFloat(document.getElementById("nInput").value);
    var b = parseFloat(document.getElementById("bInput").value);
    var e = parseFloat(document.getElementById("eInput").value);
    var f = parseFloat(document.getElementById("fInput").value);
    
    var points = Math.sqrt(n * b * b / e) / (f + 1.0);
    
    // Update the content of the resultContainer div with the calculated points
    document.getElementById("resultContainer").innerText = "Calculated points: " + points;
}
