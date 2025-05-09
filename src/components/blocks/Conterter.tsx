import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { data } from "@/data";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react"



const Converter = () => {
    const [currencyValues] = useState(data)
    const [amount, setAmount] = useState<number>(1);
    const [fromCur, setFromCur] = useState("EUR")
    const [toCur, setToCur] = useState("USD")
    const [result, setResult] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (fromCur === toCur) {
            setResult(amount);
            return;
        }

        if (!amount || isNaN(amount) || amount <= 0) return;

        const controller = new AbortController();
        setLoading(true);
        setError(null);

        (async () => {
            try {
                const res = await fetch(
                    `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=${toCur}`,
                    { signal: controller.signal }
                );
                if (!res.ok) throw new Error("API error");
                const data = await res.json();
                setResult(data.rates[toCur]);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setError("Conversion failed. Please try again.");
                    setResult(null);
                }
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [amount, fromCur, toCur]);

    return (
        <section className="flex flex-col justify-center max-w-2xl mx-auto bg-muted dark:bg-muted p-4 rounded-md gap-4">
            <div className="flex gap-2">
                <Input
                    className="flex-1"
                    placeholder="Amount"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    disabled={loading}
                    value={amount.toString()}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                            setAmount(Number(value));
                        }
                    }}
                    onKeyDown={(e) => {
                        const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab"];
                        if (
                            !/[0-9]/.test(e.key) &&
                            !allowedKeys.includes(e.key)
                        ) {
                            e.preventDefault();
                        }
                    }}
                />
                <Select value={fromCur} onValueChange={setFromCur}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="From Currency" />
                    </SelectTrigger>
                    <SelectContent>
                        {currencyValues
                            .filter((currency) => currency.code !== toCur)
                            .map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                    {currency.name}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
                <Select value={toCur} onValueChange={setToCur}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="To Currency" />
                    </SelectTrigger>
                    <SelectContent>
                        {currencyValues
                            .filter((currency) => currency.code !== fromCur)
                            .map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                    {currency.name}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>
            {loading && (
                <p className="text-center text-muted-foreground italic flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" />Converting...</p>
            )}

            {error && (
                <p className="text-center text-red-500">{error}</p>
            )}

            {!loading && !error && result !== null && amount > 0 && (
                <p className="text-lg font-semibold text-center">
                    {amount} {fromCur} = {result} {toCur}
                </p>
            )}
        </section>
    );
};

export default Converter;
