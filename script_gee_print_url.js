// COPAS kode di bawah ini ke script Google Earth Engine. Lalu, jangan lupa tambahkan asset yang ingin diekspor melalui google API.
// Selanjutnya, COPAS URL yang dihasilkan script ke dalam file tes7.html

// Load the layer from Earth Engine
var testLayer = ee.FeatureCollection('projects/ee-mangata2602/assets/Surakarta_PNBT');

// Fungsi untuk mengatur warna berdasarkan indikator
function getColor(predictedValue) {
  // Ubah nilai menjadi ee.String agar bisa diperiksa sebagai string
  var predictedString = ee.String(predictedValue);
  
  // Cek apakah 'predicted' adalah null
  var isNull = ee.Algorithms.IsEqual(predictedValue, null);
  
  // Cek apakah 'predicted' adalah string kosong
  var isEmpty = predictedString.length().eq(0);
  
  // Gunakan ee.Algorithms.If untuk memeriksa apakah 'predicted' null atau kosong
  var isEmptyOrNull = ee.Algorithms.If(
    isNull, // Kondisi pertama: jika null
    true,   // Jika isNull bernilai true, hasilnya true
    isEmpty // Jika isNull bernilai false, periksa apakah string kosong
  );
  
  // Cek apakah 'predicted' kosong atau null, return warna transparan jika true
  return ee.Algorithms.If(
    isEmptyOrNull,
    '#000000', // Warna untuk nilai null atau kosong
    ee.Algorithms.If(
      ee.Number.parse(predictedValue).lte(3500000), '#38a850',
      ee.Algorithms.If(
        ee.Number.parse(predictedValue).lte(4500000), '#66bf50',
        ee.Algorithms.If(
          ee.Number.parse(predictedValue).lte(7500000), '#8af050',
          ee.Algorithms.If(
            ee.Number.parse(predictedValue).lte(11500000), '#def250',
            ee.Algorithms.If(
              ee.Number.parse(predictedValue).lte(12500000), '#ffdd50',
              ee.Algorithms.If(
                ee.Number.parse(predictedValue).lte(15500000), '#ff9150',
                ee.Algorithms.If(
                  ee.Number.parse(predictedValue).lte(22500000), '#ff4850',
                  '#ff0050'
                )
              )
            )
          )
        )
      )
    )
  );
}

// Ambil fitur ke-200 (indeks dimulai dari 0, jadi ke-200 adalah indeks 199)
// var feature200 = ee.Feature(testLayer.toList(1, 199).get(0));
// Ambil fitur pertama dari koleksi
// var feature200 = ee.Feature(testLayer.first());

// // Ambil properti 'predicted'
// var predictedValue = feature200.get('predicted');

// // Ubah nilai menjadi ee.String agar bisa diperiksa sebagai string
// var predictedString = ee.String(predictedValue);

// // Cek apakah 'predicted' adalah null
// var isNull = ee.Algorithms.IsEqual(predictedValue, null);

// // Cek apakah 'predicted' adalah string kosong
// var isEmpty = predictedString.length().eq(0);

// // Gunakan ee.Algorithms.If untuk memeriksa apakah 'predicted' null atau kosong
// var isEmptyOrNull = ee.Algorithms.If(
//   isNull, // Kondisi pertama: jika null
//   true,   // Jika isNull bernilai true, hasilnya true
//   isEmpty // Jika isNull bernilai false, periksa apakah string kosong
// );

// // Cetak hasil pengecekan
// print('Apakah "predicted" kosong atau null?', isEmptyOrNull);

// // Konversi properti menjadi angka dan cek apakah kurang dari atau sama dengan 3500000
// var predictedNum = ee.Number.parse(feature200.get('predicted'));
// print(predictedNum);
// if (predictedNum.lte(1905688).boolean) print("jing");
// print(predictedNum.lte(1905688));

// // Konversi FeatureCollection menjadi list
// var featuresList = testLayer.toList(testLayer.size());

// // Ambil fitur dari index ke-100 hingga ke-199 (ingat, index dimulai dari 0)
// var subsetFeatures = featuresList.slice(40, 75);

// // Konversi kembali ke FeatureCollection
// var subsetFeatureCollection = ee.FeatureCollection(subsetFeatures);
// // Gunakan forEach untuk iterasi pada setiap fitur
// subsetFeatureCollection.evaluate(function(featureList2) {
//   featureList2.features.forEach(function(feature2) {
//     // Ambil nilai predicted dari feature
//     var predicted2 = ee.Feature(feature2).get('predicted');
//     print(predicted2);
//   });
// });

// Map over polygons and assign color property
var polygons = testLayer.map(function(feature) {
  var predicted = feature.get('predicted'); // Ambil nilai predicted langsung
  var color = getColor(predicted);
  return feature.set({ 'color': color }).setGeometry(feature.geometry().convexHull());
});

// Set download parameters to GeoJSON
var downloadParams = {
  format: 'GeoJSON'
};

// Get the URL to download GeoJSON
var url = polygons.getDownloadURL(downloadParams);

// Print the URL to the console
print('Download URL:', url);