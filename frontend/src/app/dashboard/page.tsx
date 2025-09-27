import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Welcome!</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Use the search bar above for natural language queries or the quick
            actions in the sidebar to get started.
          </p>

          <div className="bg-muted rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Insights & Recommendations
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-card rounded-lg border border-border">
                <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Review Outstanding Invoices
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    You have 3 invoices over 30 days past due totaling $12,450.
                    Consider following up with clients.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-card rounded-lg border border-border">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Cash Flow Alert
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Projected cash flow for next month shows a potential
                    shortfall. Review upcoming expenses.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-card rounded-lg border border-border">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Tax Preparation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Quarterly tax payments are due in 2 weeks. Ensure sufficient
                    funds are set aside.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
