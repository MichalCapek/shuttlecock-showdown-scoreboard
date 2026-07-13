import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
                    <div className="max-w-md w-full p-6 border border-border rounded-xl bg-card space-y-4 text-center">
                        <h1 className="text-2xl font-bold text-destructive">Něco se pokazilo</h1>
                        <p className="text-muted-foreground">
                            Došlo k neočekávané chybě. Zkuste obnovit stránku.
                        </p>
                        {this.state.error && (
                            <pre className="text-xs text-left bg-muted p-2 rounded overflow-auto max-h-32">
                                {this.state.error.message}
                            </pre>
                        )}
                        <div className="flex gap-2 justify-center">
                            <Button onClick={this.handleReset} variant="outline">
                                Zkusit znovu
                            </Button>
                            <Button onClick={() => window.location.reload()}>
                                Obnovit stránku
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
