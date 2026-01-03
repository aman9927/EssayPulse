import { CategorySection } from "../components/CategorySection";
import { categories } from "../lib/prompts";

export function PromptSelector() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="font-serif text-4xl font-extrabold text-text-primary mb-3">
            EssayPulse
          </h1>
          <p className="text-text-secondary text-lg max-w-md mx-auto">
            Practice narrative writing with real-time AI feedback. Choose a prompt to begin your story.
          </p>
        </header>

        {/* Categories */}
        <div className="space-y-2">
          {categories.map((category, index) => (
            <CategorySection
              key={category.id}
              category={category}
              defaultOpen={index === 0}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-text-secondary">
          <p>Write at least 150 words to receive AI feedback on your narrative.</p>
        </footer>
      </div>
    </div>
  );
}

