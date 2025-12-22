export default function Home() {
  return (
    <div className="min-h-screen bg-background-primary p-24">
      <div className="max-w-4xl mx-auto space-y-48">
        {/* Header */}
        <section>
          <h1 className="text-4xl font-bold text-brand-primary mb-16">
            Coworkers Design System
          </h1>
          <p className="text-lg text-text-secondary">
            Tailwind CSS v4 + 디자인 토큰 적용 예시
          </p>
        </section>

        {/* Colors - Brand */}
        <section className="space-y-16">
          <h2 className="text-2xl font-semibold text-text-primary">
            Brand Colors
          </h2>
          <div className="flex gap-16">
            <div className="flex-1 h-80 bg-brand-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-medium">Primary</span>
            </div>
            <div className="flex-1 h-80 bg-brand-secondary rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-medium">Secondary</span>
            </div>
            <div className="flex-1 h-80 bg-brand-tertiary rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-medium">Tertiary</span>
            </div>
          </div>
        </section>

        {/* Colors - Point */}
        <section className="space-y-16">
          <h2 className="text-2xl font-semibold text-text-primary">
            Point Colors
          </h2>
          <div className="grid grid-cols-4 gap-12">
            <div className="h-60 bg-point-purple rounded-lg" />
            <div className="h-60 bg-point-blue rounded-lg" />
            <div className="h-60 bg-point-cyan rounded-lg" />
            <div className="h-60 bg-point-pink rounded-lg" />
            <div className="h-60 bg-point-rose rounded-lg" />
            <div className="h-60 bg-point-orange rounded-lg" />
            <div className="h-60 bg-point-yellow rounded-lg" />
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-16">
          <h2 className="text-2xl font-semibold text-text-primary">
            Typography
          </h2>
          <div className="space-y-12">
            <p className="text-4xl font-bold text-text-primary">
              Text 4XL - 40px/48px Bold
            </p>
            <p className="text-3xl font-semibold text-text-primary">
              Text 3XL - 32px/38px Semibold
            </p>
            <p className="text-2xl font-medium text-text-primary">
              Text 2XL - 24px/28px Medium
            </p>
            <p className="text-xl font-regular text-text-secondary">
              Text XL - 20px/24px Regular
            </p>
            <p className="text-lg text-text-secondary">Text LG - 18px/21px</p>
            <p className="text-md text-text-default">Text MD - 14px/17px</p>
            <p className="text-sm text-text-default">Text SM - 13px/16px</p>
            <p className="text-xs text-text-disabled">Text XS - 12px/14px</p>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-16">
          <h2 className="text-2xl font-semibold text-text-primary">Buttons</h2>
          <div className="flex gap-16">
            <button className="px-24 py-12 bg-brand-primary hover:bg-interaction-hover active:bg-interaction-pressed text-white font-semibold rounded-lg transition-colors">
              Primary Button
            </button>
            <button className="px-24 py-12 bg-background-secondary hover:bg-background-tertiary text-text-primary font-semibold rounded-lg transition-colors">
              Secondary Button
            </button>
            <button className="px-24 py-12 bg-transparent border-2 border-border-primary hover:bg-background-secondary text-text-primary font-semibold rounded-lg transition-colors">
              Outline Button
            </button>
            <button className="px-24 py-12 bg-status-danger hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
              Danger Button
            </button>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-16">
          <h2 className="text-2xl font-semibold text-text-primary">Cards</h2>
          <div className="grid grid-cols-2 gap-16">
            <div className="bg-background-secondary p-24 rounded-lg border border-border-primary">
              <h3 className="text-xl font-bold text-brand-secondary mb-8">
                Card Title
              </h3>
              <p className="text-md text-text-secondary">
                카드 컴포넌트 예시입니다. 배경색, 테두리, 간격 등이 적용되어
                있습니다.
              </p>
            </div>
            <div className="bg-background-tertiary p-24 rounded-lg">
              <h3 className="text-xl font-bold text-point-cyan mb-8">
                Tertiary Card
              </h3>
              <p className="text-md text-text-tertiary">
                다양한 배경색과 포인트 컬러를 활용할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Status & Icons */}
        <section className="space-y-16">
          <h2 className="text-2xl font-semibold text-text-primary">
            Status & Badges
          </h2>
          <div className="flex gap-12">
            <span className="px-12 py-6 bg-interaction-focus text-gray-900 text-sm font-medium rounded">
              Active
            </span>
            <span className="px-12 py-6 bg-interaction-inactive text-gray-900 text-sm font-medium rounded">
              Inactive
            </span>
            <span className="px-12 py-6 bg-status-danger text-white text-sm font-medium rounded">
              Error
            </span>
            <span className="px-12 py-6 bg-icon-brand text-white text-sm font-medium rounded">
              Success
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
