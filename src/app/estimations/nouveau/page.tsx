'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Step 1: Project info
// Step 2: Details / Description
// Step 3: Upload documents
// Step 4: Confirmation

const STEPS = [
    { title: 'Informations du projet', icon: '📋' },
    { title: 'Description des travaux', icon: '✏️' },
    { title: 'Documents & fichiers', icon: '📎' },
    { title: 'Confirmation', icon: '✅' },
];

const WORK_TYPES = [
    'Rénovation complète',
    'Cuisine / Salle de bain',
    'Peinture & Revêtements',
    'Isolation thermique',
    'Électricité',
    'Plomberie',
    'Maçonnerie / Gros œuvre',
    'Menuiseries',
    'Autre',
];

export default function NouvelleEstimationPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        title: '',
        address: '',
        surface: '',
        workTypes: [] as string[],
        description: '',
        budget: '',
        deadline: '',
        files: [] as File[],
    });

    const toggleWorkType = (type: string) => {
        setForm((prev) => ({
            ...prev,
            workTypes: prev.workTypes.includes(type)
                ? prev.workTypes.filter((t) => t !== type)
                : [...prev.workTypes, type],
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            // TODO: upload files to Supabase Storage and save estimation
            // For now, redirect to estimations list
            await new Promise((r) => setTimeout(r, 1500));
            router.push('/estimations');
        } finally {
            setSubmitting(false);
        }
    };

    const canNext = () => {
        if (step === 0) return form.title.length > 0 && form.workTypes.length > 0;
        if (step === 1) return form.description.length > 10;
        return true;
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-heading font-extrabold text-rapido-blue">
                    Nouvelle estimation
                </h1>
                <p className="text-zinc-500 text-sm mt-1">
                    Remplissez les informations pour lancer votre estimation.
                </p>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2">
                {STEPS.map((s, i) => (
                    <div key={i} className="flex items-center flex-1 gap-2">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm flex-shrink-0 transition-colors ${i < step
                                    ? 'bg-rapido-green text-white'
                                    : i === step
                                        ? 'bg-rapido-blue text-white'
                                        : 'bg-zinc-200 text-zinc-400'
                                }`}
                        >
                            {i < step ? '✓' : i + 1}
                        </div>
                        <span className={`text-xs hidden sm:block ${i === step ? 'font-semibold text-rapido-blue' : 'text-zinc-400'}`}>
                            {s.title}
                        </span>
                        {i < STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 ${i < step ? 'bg-rapido-green' : 'bg-zinc-200'}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step content */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6">

                {/* STEP 0 — Project info */}
                {step === 0 && (
                    <div className="space-y-5">
                        <div>
                            <label className="text-sm font-medium mb-1.5 block text-rapido-blue">
                                Titre du projet <span className="text-rapido-orange">*</span>
                            </label>
                            <Input
                                placeholder="ex: Rénovation appartement T3 Lyon 3ème"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1.5 block text-rapido-blue">
                                Adresse du bien
                            </label>
                            <Input
                                placeholder="ex: 12 rue de la Paix, 75001 Paris"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1.5 block text-rapido-blue">
                                Surface approximative (m²)
                            </label>
                            <Input
                                type="number"
                                placeholder="ex: 65"
                                value={form.surface}
                                onChange={(e) => setForm({ ...form, surface: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block text-rapido-blue">
                                Type de travaux <span className="text-rapido-orange">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {WORK_TYPES.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => toggleWorkType(type)}
                                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${form.workTypes.includes(type)
                                                ? 'border-rapido-blue bg-rapido-blue text-white'
                                                : 'border-zinc-300 text-zinc-600 hover:border-rapido-blue hover:text-rapido-blue'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 1 — Description */}
                {step === 1 && (
                    <div className="space-y-5">
                        <div>
                            <label className="text-sm font-medium mb-1.5 block text-rapido-blue">
                                Description détaillée des travaux <span className="text-rapido-orange">*</span>
                            </label>
                            <textarea
                                rows={6}
                                placeholder="Décrivez précisément les travaux souhaités : état actuel du bien, ce que vous voulez réaliser, contraintes particulières (copropriété, bâtiment classé, etc.)..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                            />
                            <p className="text-xs text-zinc-400 mt-1">{form.description.length} caractères (minimum 10)</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium mb-1.5 block text-rapido-blue">
                                    Budget cible (€ HT)
                                </label>
                                <Input
                                    type="number"
                                    placeholder="ex: 50000"
                                    value={form.budget}
                                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block text-rapido-blue">
                                    Date souhaitée des travaux
                                </label>
                                <Input
                                    type="date"
                                    value={form.deadline}
                                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2 — Upload */}
                {step === 2 && (
                    <div className="space-y-5">
                        <p className="text-sm text-zinc-600">
                            Ajoutez des plans, photos ou tout document utile pour affiner votre estimation.
                            Formats acceptés : PDF, JPG, PNG, XLSX (max 20 Mo par fichier).
                        </p>

                        <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-300 cursor-pointer p-10 hover:border-rapido-blue hover:bg-rapido-blue/5 transition-colors text-center">
                            <div className="text-4xl">📁</div>
                            <div>
                                <p className="font-medium text-rapido-blue">Glissez vos fichiers ici</p>
                                <p className="text-sm text-zinc-400 mt-1">ou cliquez pour parcourir</p>
                            </div>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.xlsx"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setForm({ ...form, files: [...form.files, ...Array.from(e.target.files)] });
                                    }
                                }}
                            />
                        </label>

                        {form.files.length > 0 && (
                            <div className="space-y-2">
                                {form.files.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between rounded-lg bg-zinc-50 border border-zinc-200 px-4 py-2 text-sm">
                                        <span className="text-zinc-700 truncate">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => setForm({ ...form, files: form.files.filter((_, j) => j !== i) })}
                                            className="ml-3 text-zinc-400 hover:text-red-500 flex-shrink-0"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 3 — Confirmation */}
                {step === 3 && (
                    <div className="space-y-5">
                        <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-5 space-y-3">
                            <h3 className="font-semibold text-rapido-blue">Récapitulatif</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Projet</span>
                                    <span className="font-medium text-rapido-blue truncate max-w-xs">{form.title}</span>
                                </div>
                                {form.address && (
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Adresse</span>
                                        <span className="font-medium">{form.address}</span>
                                    </div>
                                )}
                                {form.surface && (
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Surface</span>
                                        <span className="font-medium">{form.surface} m²</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Travaux</span>
                                    <span className="font-medium text-right max-w-xs">{form.workTypes.join(', ')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Fichiers</span>
                                    <span className="font-medium">{form.files.length} fichier(s)</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-rapido-blue/5 border border-rapido-blue/20 p-4 text-sm text-zinc-600">
                            <p>
                                ⏱️ <strong>Délai estimé :</strong> votre devis vous sera envoyé par email sous
                                <strong> 48h ouvrées</strong> à compter de la réception de votre demande.
                            </p>
                        </div>

                        <p className="text-xs text-zinc-400">
                            En soumettant ce formulaire, vous acceptez que nos équipes accèdent à vos documents
                            pour préparer votre estimation.
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => step > 0 ? setStep(step - 1) : router.push('/dashboard')}
                    className="rounded-full"
                >
                    ← {step === 0 ? 'Retour' : 'Précédent'}
                </Button>

                {step < STEPS.length - 1 ? (
                    <Button
                        onClick={() => setStep(step + 1)}
                        disabled={!canNext()}
                        className="bg-rapido-blue hover:bg-rapido-blue-700 text-white rounded-full disabled:opacity-40"
                    >
                        Suivant →
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-rapido-green hover:bg-rapido-green-600 text-white rounded-full"
                    >
                        {submitting ? 'Envoi en cours...' : '✅ Soumettre l\'estimation'}
                    </Button>
                )}
            </div>
        </div>
    );
}
