import prisma from "@/utils/db";
import { withPrismaRetry } from "@/utils/retryUtils";
import { carouselHome, mainCities, mainSpecialities, offers as staticOffers } from "@/static/data/staticData";

export type HomeSectionOrderItem = {
	id: number;
	area: string;
	order: number;
};

export type HomeCarouselItem = {
	id: number;
	text: string;
	image: string | null;
	order: number | null;
};

export type HomeMainSpecialityItem = {
	id: number;
	title: string;
	description: string | null;
	image: string | null;
	link: string | null;
	order: number | null;
};

export type HomeMainProvinceItem = {
	id: number;
	title: string;
	description: string | null;
	image: string | null;
	link: string | null;
	order: number | null;
};

export type HomeMainOfferItem = {
	id: number;
	title: string;
	description: string | null;
	image: string | null;
	link: string | null;
	order: number | null;
};

export type PublicHomeStructurePayload = {
	home: {
		sections_order: HomeSectionOrderItem[];
		carousel: HomeCarouselItem[];
		main_provinces: HomeMainProvinceItem[];
		main_specialities: HomeMainSpecialityItem[];
		offers: HomeMainOfferItem[];
	};
};

const staticSectionsOrder: HomeSectionOrderItem[] = [
	{ id: 1, area: "home", order: 1 },
	{ id: 2, area: "about", order: 2 },
	{ id: 3, area: "services", order: 3 },
	{ id: 4, area: "offers", order: 4 },
];

export const getPublicHomeStructureService = async (): Promise<PublicHomeStructurePayload> => {
	const [sectionsOrder, carousel, mainProvinces, mainSpecialities, mainOffers] = await Promise.all([
		withPrismaRetry(() =>
			prisma.homePageOrder.findMany({
				orderBy: { order: "asc" },
			})
		),
		withPrismaRetry(() =>
			prisma.homePageDataCarousel.findMany({
				orderBy: [{ order: "asc" }, { created_at: "asc" }],
			})
		),
		withPrismaRetry(() =>
			prisma.homePageDataMainProvinces.findMany({
				orderBy: [{ order: "asc" }, { created_at: "asc" }],
			})
		),
		withPrismaRetry(() =>
			prisma.homePageDataMainEspecialities.findMany({
				orderBy: [{ order: "asc" }, { created_at: "asc" }],
			})
		),
		withPrismaRetry(() =>
			prisma.homePageDataMainOffers.findMany({
				orderBy: [{ order: "asc" }, { created_at: "asc" }],
			})
		),
	]);

	const mappedSectionsOrder = sectionsOrder.map<HomeSectionOrderItem>((item) => ({
		id: item.id,
		area: item.area,
		order: item.order,
	}));

	const mappedCarousel = carousel.map<HomeCarouselItem>((item) => ({
		id: item.id,
		text: item.title,
		image: item.image,
		order: item.order,
	}));

	const mappedMainSpecialities = mainSpecialities.map<HomeMainSpecialityItem>((item) => ({
		id: item.id,
		title: item.speciality,
		description: item.description,
		image: item.image,
		link: item.link,
		order: item.order,
	}));

	const mappedMainProvinces = mainProvinces.map<HomeMainProvinceItem>((item) => ({
		id: item.id,
		title: item.title,
		description: item.description,
		image: item.image,
		link: item.link,
		order: item.order,
	}));

	const mappedMainOffers = mainOffers.map<HomeMainOfferItem>((item) => ({
		id: item.id,
		title: item.title,
		description: item.description,
		image: item.image,
		link: item.link,
		order: item.order,
	}));

	const staticCarouselFallback: HomeCarouselItem[] = carouselHome.map((item: any, index: number) => ({
		id: -(index + 1),
		text: item.text,
		image: item.image ?? null,
		order: index + 1,
	}));

	const staticSpecialitiesFallback: HomeMainSpecialityItem[] = mainSpecialities.map((item: any, index: number) => ({
		id: -(index + 1),
		title: item.title,
		description: null,
		image: item.image ?? null,
		link: null,
		order: index + 1,
	}));

	const staticProvincesFallback: HomeMainProvinceItem[] = mainCities.map((item: any, index: number) => ({
		id: -(index + 1),
		title: item.title,
		description: null,
		image: item.image ?? null,
		link: item.link ?? "/offers",
		order: index + 1,
	}));

	const staticOffersFallback: HomeMainOfferItem[] = staticOffers.map((item: any, index: number) => ({
		id: -(index + 1),
		title: item.title,
		description: null,
		image: item.image ?? null,
		link: item.link ?? "/offers",
		order: index + 1,
	}));

	const offersWithFallback = mappedMainOffers.length > 0 ? mappedMainOffers : staticOffersFallback;

	return {
		home: {
			sections_order: mappedSectionsOrder.length > 0 ? mappedSectionsOrder : staticSectionsOrder,
			carousel: mappedCarousel.length > 0 ? mappedCarousel : staticCarouselFallback,
			main_provinces: mappedMainProvinces.length > 0 ? mappedMainProvinces : staticProvincesFallback,
			main_specialities: mappedMainSpecialities.length > 0 ? mappedMainSpecialities : staticSpecialitiesFallback,
			offers: offersWithFallback,
		},
	};
};
