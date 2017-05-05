/**
 * Dieses HTML-Attribut kennzeichnet einen Behälter (z.B. <div>) für drei 
 * (optionale) klickbare Elemente (z.B. <button>), die folgende Wirkungen haben:
 * - Datei aus einem Dialog auswählen lassen
 * - Dateiauswahl aufheben, sodass dann keine Datei gewählt ist
 * - Inhalt der aktuellen Datei unter einem beliebigen Namen herunterladen
 * 
 * Die klickbaren Elemente werden durch die Attribute "file-select",
 * "file-unselect" bzw. "file-download" gekennzeichnet.
 * 
 * Der Inhalt der ausgewählten Datei wird als Data-URL an eine Scope-Variable
 * gebunden. Die Scope-Variable legt man wie üblich mit dem Attribut "ng-model"
 * fest. Ist keine Datei ausgewählt, erhält die Scope-Variable den Wert null.
 * 
 * Die zur Auswahl angebotenen Dateitypen kann man mit dem optionalen 
 * "accept"-Attribut einschränken.
 * 
 * Anwendungsbeispiel für Grafikdateien:
 * 
 * <div file-chooser ng-model="..." accept="image/*">
 *   <button file-select>Datei auswählen...</button>
 *   <button file-unselect>Nichts auswählen</button>
 *   <button file-download="dateiname">Herunterladen</button>
 *   ...
 * </div>
 */
app.directive("fileChooser", function($document) {
  
  return {
    require: "ngModel",
    
    scope: { accept: "@" },
    
    link: function(scope, elem, attrs, ngModel) {
      
      // Unsichtbares <input type="file">-Element erzeugen und konfigurieren
      var input = angular
        .element("<input type='file' style='display: none'>")
        .attr("accept", scope.accept)
        
        // Auf Beenden des Dateiauswahldialogs reagieren
        .on("change", function(evt) {
          // Wurde eine Datei ausgewählt?
          var datei = evt.target.files[0];
          if (datei) {
            // Datei als Data-URL einlesen
            var reader = new FileReader();
            
            reader.onload = function() {
              // Data-URL in das Scope übernehmen
              ngModel.$setViewValue(this.result);
            };
            
            reader.readAsDataURL(datei);
          }
        });
      
      // <input>-Element in diesen Behälter einfügen
      elem.append(input);
      
      // Dateiauswahldialog anzeigen und Datei auswählen lassen
      angular.forEach(elem[0].querySelectorAll("[file-select]"),
          function(el) {
            el.addEventListener("click", function() { input[0].click(); });
          }
      );
      
      // Dateiauswahl aufheben
      angular.forEach(elem[0].querySelectorAll("[file-unselect]"),
          function(el) {
            el.addEventListener("click", function() { 
              ngModel.$setViewValue(null);
            });
          }
      );
      
      // Download der zuletzt ausgewählten Datei starten
      angular.forEach(elem[0].querySelectorAll("[file-download]"),
          function(el) {
            el.addEventListener("click", function() {
              if (ngModel.$viewValue) {
                // Link auf Data-URL in diesen Behälter einfügen und anklicken
                var link = $document[0].createElement("a");
                link.href = ngModel.$viewValue;
                link.download = el.getAttribute("file-download") || "datei";
                elem[0].appendChild(link);
                link.click();
                elem[0].removeChild(link);
              }
            });
          }
      );
    }
  };
  
});
