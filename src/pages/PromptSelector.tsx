import { CategorySection } from "../components/CategorySection";
import { categories } from "../lib/prompts";

export function PromptSelector() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-3xl mx-auto px-8 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="tw-h1">EssayPulse</h1>
          <p className="tw-body mt-6" style={{ maxWidth: "500px", margin: "1.5rem auto 0" }}>
            Practice narrative writing with real-time AI feedback.
            <br />
            <span className="tw-caption">Choose a prompt to begin your story.</span>
          </p>
        </header>

        <div className="tw-divider">═ ═ ═ ═ ═</div>

        {/* Categories */}
        <div className="space-y-4">
          {categories.map((category, index) => (
            <CategorySection
              key={category.id}
              category={category}
              defaultOpen={index === 0}
            />
          ))}
        </div>

        <div className="tw-divider">— — —</div>

        {/* Footer */}
        <footer className="text-center">
          <div className="tw-alert tw-alert-info inline-block text-left mx-auto">
            <span className="tw-alert-icon">ℹ</span>
            <p className="tw-body-sm">
              Write at least 150 words to receive AI feedback on your narrative.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
