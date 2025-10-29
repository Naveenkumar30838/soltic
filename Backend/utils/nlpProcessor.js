import nlp from 'compromise';
import nlpDates from 'compromise-dates'; // ✅ plugin import

// Register the plugin
nlp.extend(nlpDates);

export function analyzeMessage(message) {
  const doc = nlp(message);

  // Extract entities
  const destinations = doc.match('#Place').out('array');
  const dates = doc.dates().out('array'); // ✅ now this will work
  const numbers = doc.numbers().out('array');

  return {
    destinations,
    dates,
    numbers
  };
}

// Quick test
// console.log(analyzeMessage("Book a Trip for Goa for 5 Peoples in the next weekend"));
// console.log(analyzeMessage("I want a Hilly Station Trip next Weekend"));
console.log("Fetch Places for French cuisine")
