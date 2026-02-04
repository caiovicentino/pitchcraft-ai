'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Download, Presentation, Rocket, Target, TrendingUp, Users, Zap, CheckCircle2, ArrowRight, Star, Loader2 } from 'lucide-react';

interface PitchSlide {
  title: string;
  content: string;
  notes?: string;
}

interface PitchDeck {
  companyName: string;
  tagline: string;
  slides: PitchSlide[];
}

export default function Home() {
  const [step, setStep] = useState<'form' | 'generating' | 'result'>('form');
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    problem: '',
    solution: '',
    targetMarket: '',
    businessModel: '',
    traction: '',
    team: '',
    askAmount: '',
  });
  const [pitchDeck, setPitchDeck] = useState<PitchDeck | null>(null);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const generatePitchDeck = async () => {
    setStep('generating');
    setError('');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar pitch deck');
      }

      const data = await response.json();
      setPitchDeck(data);
      setStep('result');
    } catch (err) {
      setError('Erro ao gerar pitch deck. Tente novamente.');
      setStep('form');
    }
  };

  const downloadPPTX = async () => {
    if (!pitchDeck) return;
    
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pitchDeck),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pitchDeck.companyName.replace(/\s+/g, '-')}-pitch-deck.pptx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Presentation className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              PitchCraft AI
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>4.9/5 de 500+ usuários</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {step === 'form' && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by AI — Crie pitch decks em minutos
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Transforme sua ideia em um{' '}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Pitch Deck Profissional
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
              Nossa IA cria apresentações de investimento impactantes, 
              estruturadas e prontas para impressionar. Sem design. Sem horas de trabalho.
            </p>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Zap className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Rápido</h3>
                <p className="text-sm text-slate-600">Gere em menos de 2 minutos</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Target className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Estruturado</h3>
                <p className="text-sm text-slate-600">Formato padrão de investidores</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Editável</h3>
                <p className="text-sm text-slate-600">Exporte em PowerPoint</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Form Section */}
      {step === 'form' && (
        <section className="pb-20 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <h2 className="text-xl font-bold text-slate-900">Conte sobre sua empresa</h2>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nome da empresa *
                    </label>
                    <Input
                      name="companyName"
                      placeholder="Ex: TechFlow"
                      value={formData.companyName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Setor/Indústria *
                    </label>
                    <Input
                      name="industry"
                      placeholder="Ex: SaaS, FinTech, HealthTech"
                      value={formData.industry}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Qual problema você resolve? *
                  </label>
                  <Textarea
                    name="problem"
                    placeholder="Descreva o problema que seus clientes enfrentam..."
                    value={formData.problem}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Qual é sua solução? *
                  </label>
                  <Textarea
                    name="solution"
                    placeholder="Como seu produto/serviço resolve esse problema..."
                    value={formData.solution}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Mercado-alvo
                    </label>
                    <Input
                      name="targetMarket"
                      placeholder="Ex: PMEs no Brasil"
                      value={formData.targetMarket}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Modelo de negócio
                    </label>
                    <Input
                      name="businessModel"
                      placeholder="Ex: SaaS mensal, Marketplace"
                      value={formData.businessModel}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tração atual (opcional)
                  </label>
                  <Input
                    name="traction"
                    placeholder="Ex: 500 usuários, R$50k MRR, 30% growth m/m"
                    value={formData.traction}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Time fundador
                    </label>
                    <Input
                      name="team"
                      placeholder="Ex: 2 founders, ex-Google, ex-iFood"
                      value={formData.team}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Investimento buscado
                    </label>
                    <Input
                      name="askAmount"
                      placeholder="Ex: R$ 2M Seed"
                      value={formData.askAmount}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full mt-4" 
                  size="lg"
                  onClick={generatePitchDeck}
                  disabled={!formData.companyName || !formData.problem || !formData.solution}
                >
                  <Sparkles className="w-5 h-5" />
                  Gerar Pitch Deck com IA
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <p className="text-center text-sm text-slate-500">
                  ✨ Grátis • Sem cadastro • Pronto em 2 minutos
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Generating State */}
      {step === 'generating' && (
        <section className="py-32 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-pulse">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Criando seu Pitch Deck...
            </h2>
            <p className="text-slate-600 mb-8">
              Nossa IA está estruturando sua apresentação com slides impactantes para investidores.
            </p>
            <div className="space-y-3">
              {['Analisando seu negócio', 'Estruturando narrativa', 'Criando slides', 'Finalizando deck'].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-600 justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Result Section */}
      {step === 'result' && pitchDeck && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <CheckCircle2 className="w-4 h-4" />
                Pitch Deck gerado com sucesso!
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {pitchDeck.companyName}
              </h2>
              <p className="text-lg text-slate-600">{pitchDeck.tagline}</p>
            </div>

            {/* Slides Preview */}
            <div className="space-y-4 mb-8">
              {pitchDeck.slides.map((slide, index) => (
                <div key={index} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-100">
                    <span className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </span>
                    <h3 className="font-semibold text-slate-900">{slide.title}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-700 whitespace-pre-wrap">{slide.content}</p>
                    {slide.notes && (
                      <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <p className="text-sm text-amber-800">
                          <strong>💡 Dica:</strong> {slide.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={downloadPPTX}>
                <Download className="w-5 h-5" />
                Baixar PowerPoint (.pptx)
              </Button>
              <Button variant="outline" size="lg" onClick={() => {
                setStep('form');
                setPitchDeck(null);
              }}>
                Criar Novo Pitch Deck
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            © 2026 PitchCraft AI — Feito com 💜 para empreendedores
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Projeto do Desafio 10 Dias de Produtos AI
          </p>
        </div>
      </footer>
    </div>
  );
}
