import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Home() {
  const [formData, setFormData] = useState({
    colaboradorId: "",
    data: "",
    matricula: "",
    localidade: "",
    motivo: "",
    klm: "",
  });

  const { data: colaboradores, isLoading } = trpc.colaboradores.list.useQuery();
  const createRelatorio = trpc.relatorios.create.useMutation({
    onSuccess: () => {
      toast.success("Relatório enviado com sucesso!");
      setFormData({
        colaboradorId: "",
        data: "",
        matricula: "",
        localidade: "",
        motivo: "",
        klm: "",
      });
    },
    onError: (error) => {
      toast.error("Erro ao enviar relatório: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.colaboradorId || !formData.data || !formData.matricula || 
        !formData.localidade || !formData.motivo || !formData.klm) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    createRelatorio.mutate({
      colaboradorId: parseInt(formData.colaboradorId),
      data: formData.data,
      matricula: formData.matricula,
      localidade: formData.localidade,
      motivo: formData.motivo,
      klm: parseInt(formData.klm),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
            ADMIN
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md mb-6">
        <img 
          src="/logo-expressglass.png" 
          alt="ExpressGlass" 
          className="h-12 mx-auto mb-4 bg-white px-6 py-2 rounded-lg"
        />
        <h1 className="text-3xl font-bold text-white text-center mb-2">MAPA KLM</h1>
        <p className="text-white/90 text-center">Despesas de KM em Viatura Própria</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Registo KLM</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Select
                value={formData.colaboradorId}
                onValueChange={(value) => setFormData({ ...formData, colaboradorId: value })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoading ? "A carregar..." : "Selecione o colaborador"} />
                </SelectTrigger>
                <SelectContent>
                  {colaboradores?.map((colab) => (
                    <SelectItem key={colab.id} value={colab.id.toString()}>
                      {colab.nome} ({colab.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula *</Label>
              <Input
                id="matricula"
                type="text"
                placeholder="Ex: AT-29-XC"
                value={formData.matricula}
                onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="localidade">Localidade *</Label>
              <Input
                id="localidade"
                type="text"
                placeholder="Destino da viagem"
                value={formData.localidade}
                onChange={(e) => setFormData({ ...formData, localidade: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo *</Label>
              <Textarea
                id="motivo"
                placeholder="Descreva o motivo da deslocação"
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="klm">KLM *</Label>
              <Input
                id="klm"
                type="number"
                placeholder="Total (ida e volta)"
                value={formData.klm}
                onChange={(e) => setFormData({ ...formData, klm: e.target.value })}
                required
                min="1"
              />
              <p className="text-xs text-muted-foreground">Coloca o total (ida e volta)</p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={createRelatorio.isPending}
            >
              {createRelatorio.isPending ? "A enviar..." : "Submeter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

